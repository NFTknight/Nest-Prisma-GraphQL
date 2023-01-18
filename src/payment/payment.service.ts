import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { firstValueFrom, map } from 'rxjs';
import { PaymentConfig } from 'src/common/configs/config.interface';
import { throwNotFoundException } from 'src/utils/validation';
import { ExecutePaymentApiRequest } from './dto/execute-payment.dto';
import { PaymentStatusApiRequest } from './dto/payment-status.dto';
import { PaymentSession } from './models/payment-session.model';

const OrderInvoiceStatus = {
  PENDING: 'Pending',
  PAID: 'Paid',
  CANCELED: 'Canceled',
};

@Injectable()
export class PaymentService {
  private readonly paymentConfig: PaymentConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.paymentConfig = this.config.get<PaymentConfig>('payment');
  }

  initiateSession() {
    const url = `${this.paymentConfig.url}/v2/InitiateSession`;
    return firstValueFrom(
      this.httpService
        .post<{
          Data: PaymentSession;
        }>(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.paymentConfig.token}`,
            },
          }
        )
        .pipe(map((res) => res.data.Data))
    );
  }

  async executePayment(orderId: string, sessionId: string, vendorSlug: string) {
    const url = `${this.paymentConfig.url}/v2/ExecutePayment`;
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    throwNotFoundException(order, 'Order');
    // TODO callback url should be dynamic
    // TODO DisplayCurrencyIso should be dynamic
    const data: ExecutePaymentApiRequest = {
      SessionId: sessionId,
      InvoiceValue: order.subTotal,
      CustomerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      DisplayCurrencyIso: this.paymentConfig.currency,
      CustomerEmail: order.customerInfo.email,
      CustomerReference: order.orderId,
      CallBackUrl: `${this.paymentConfig.clientUrl}/${vendorSlug}/checkout/${orderId}/confirmation`,
      ErrorUrl: `${this.paymentConfig.clientUrl}/${vendorSlug}/checkout/${orderId}/failure`,
      InvoiceItems: order.items.map((item) => ({
        ItemName: `${item.productId}_${item.sku}`,
        Quantity: item.quantity,
        UnitPrice: item.price,
      })),
    };

    return firstValueFrom(
      this.httpService
        .post(url, data, {
          headers: {
            Authorization: `Bearer ${this.paymentConfig.token}`,
          },
        })
        .pipe(map((res) => res.data.Data))
    );
  }

  async checkPaymentStatus(orderId: string) {
    const url = `${this.paymentConfig.url}/v2/GetPaymentStatus`;

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    throwNotFoundException(order, 'Order');

    const data: PaymentStatusApiRequest = {
      Key: order.invoiceId,
      KeyType: 'invoiceid',
    };

    const res = await firstValueFrom(
      this.httpService
        .post(url, data, {
          headers: {
            Authorization: `Bearer ${this.paymentConfig.token}`,
          },
        })
        .pipe(
          map((res) => {
            return res.data.Data;
          })
        )
    );
    let orderStatus = order.status;
    if (res?.InvoiceStatus !== OrderInvoiceStatus.PENDING) {
      try {
        orderStatus =
          res?.InvoiceStatus === OrderInvoiceStatus.PAID
            ? OrderStatus.PENDING
            : OrderStatus.FAILED;

        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: orderStatus, updatedAt: new Date() },
        });
      } catch (error) {
        throw new NotFoundException('Order Status is not updated.', error);
      }
    }

    return {
      orderStatus,
      paymentStatus: res?.InvoiceStatus,
    };
  }
}
