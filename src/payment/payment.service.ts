import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import { firstValueFrom, map } from 'rxjs';
import { PaymentConfig } from 'src/common/configs/config.interface';
import { ExecutePaymentApiRequest } from './dto/execute-payment.dto';
import { PaymentSession } from './models/payment-session.model';

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

  async executePayment(orderId: string, sessionId: string) {
    const url = `${this.paymentConfig.url}/v2/ExecutePayment`;
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    // TODO callback url should be dynamic
    // TODO DisplayCurrencyIso should be dynamic
    const data: ExecutePaymentApiRequest = {
      SessionId: sessionId,
      InvoiceValue: order.totalPrice,
      CustomerName: `${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      DisplayCurrencyIso: 'KWD',
      CustomerEmail: order.customerInfo.email,
      CustomerReference: order.orderId,
      CallBackUrl: `http://api.dev.anyaa.io/api/payment/callback`,
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
}
