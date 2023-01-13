import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { firstValueFrom, map } from 'rxjs';
import { PaymentConfig } from 'src/common/configs/config.interface';
import { VendorsService } from 'src/vendors/vendors.service';
import { throwNotFoundException } from 'src/utils/validation';
import { ExecutePaymentApiRequest } from './dto/execute-payment.dto';
import { PaymentStatusApiRequest } from './dto/payment-status.dto';
import {
  RefundPaymentApiRequest,
  SupplierRefundPaymentApiRequest,
} from './dto/refund-payment.dto';
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
    private readonly prisma: PrismaService,
    private readonly vendorService: VendorsService
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
    const data: ExecutePaymentApiRequest = {
      SessionId: sessionId,
      InvoiceValue: order.subTotal,
      CustomerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      DisplayCurrencyIso: 'KWD',
      CustomerEmail: order.customerInfo.email,
      CustomerReference: order.orderId,
      CallBackUrl: `https://app.dev.anyaa.io/${vendorSlug}/checkout/${orderId}/confirmation`,
      ErrorUrl: `https://app.dev.anyaa.io/${vendorSlug}/checkout/${orderId}/failure`,
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

    const response = await firstValueFrom(
      this.httpService
        .post(url, data, {
          headers: {
            Authorization: `Bearer ${this.paymentConfig.token}`,
          },
        })
        .pipe(map((res) => res.data.Data))
    );
    let orderStatus = order.status;
    if (response?.InvoiceStatus !== OrderInvoiceStatus.PENDING) {
      try {
        orderStatus =
          response?.InvoiceStatus === OrderInvoiceStatus.PAID
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
      paymentStatus: response?.InvoiceStatus,
    };
  }

  async refundPayment(orderId: string) {
    const url = `${this.paymentConfig.url}/v2/MakeRefund`;

    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new NotFoundException('Order Not Found.');

    const data: RefundPaymentApiRequest = {
      Key: order.invoiceId,
      KeyType: 'invoiceid',
      RefundChargeOnCustomer: true,
      ServiceChargeOnCustomer: true,
      Amount: order.finalPrice,
      Comment: `${order.invoiceId}`, // For reference, this key will return with response.
      AmountDeductedFromSupplier: 0,
    };

    let responseData = {};
    let errors = undefined;
    try {
      responseData = await firstValueFrom(
        this.httpService
          .post(url, data, {
            headers: {
              Authorization: `Bearer ${this.paymentConfig.token}`,
            },
          })
          .pipe(map((res) => res.data?.Data))
      );
    } catch (error) {
      errors = error.response.data.ValidationErrors;
    }
    return {
      responseData,
      errors,
    };
  }

  async supplierRefundPayment(orderId: string) {
    const url = `${this.paymentConfig.url}/v2/MakeSupplierRefund`;

    // Todo [QASIM]: Need to use orderService but for now skipping because of circular dependencies issue
    // [NOTE]: forwardRef is not working in this case
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new NotFoundException('Order Not Found.');

    const vendor = await this.vendorService.getVendor(order.vendorId);

    const data: SupplierRefundPaymentApiRequest = {
      Key: order.invoiceId,
      KeyType: 'invoiceid',
      VendorDeductAmount: order.finalPrice,
      Comment: `${order.invoiceId}`, // For reference, this key will return with response.
      Suppliers: [
        {
          SupplierCode: vendor?.MF_vendorCode,
          SupplierDeductedAmount: 0,
        },
      ],
    };

    let responseData = {};
    let errors = undefined;
    try {
      responseData = await firstValueFrom(
        this.httpService
          .post(url, data, {
            headers: {
              Authorization: `Bearer ${this.paymentConfig.token}`,
            },
          })
          .pipe(map((res) => res.data?.Data))
      );
    } catch (error) {
      errors = error.response.data.ValidationErrors;
    }
    return {
      responseData,
      errors,
    };
  }

  async checkRefundPaymentStatus(invoiceId: string) {
    const url = `${this.paymentConfig.url}/v2/GetRefundStatus`;

    const data: PaymentStatusApiRequest = {
      Key: invoiceId,
      KeyType: 'invoiceid',
    };

    let response = {};
    let errors = undefined;
    try {
      response = await firstValueFrom(
        this.httpService
          .post(url, data, {
            headers: {
              Authorization: `Bearer ${this.paymentConfig.token}`,
            },
          })
          .pipe(map((res) => res.data.Data))
      );
    } catch (error) {
      errors = error.response.data.ValidationErrors;
    }

    return {
      ...response,
      errors,
    };
  }
}
