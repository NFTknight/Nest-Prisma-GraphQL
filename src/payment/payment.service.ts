import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { PaymentConfig } from 'src/common/configs/config.interface';
import { PaymentMethod } from './models/payment-method.model';

@Injectable()
export class PaymentService {
  private readonly paymentConfig: PaymentConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService
  ) {
    this.paymentConfig = this.config.get<PaymentConfig>('payment');
  }

  initiatePayment(amount: number, currency: string) {
    const url = `${this.paymentConfig.url}/v2/InitiatePayment`;
    return firstValueFrom(
      this.httpService
        .post<{
          Data: {
            PaymentMethods: PaymentMethod[];
          };
        }>(
          url,
          {
            InvoiceAmount: amount,
            CurrencyIso: currency,
          },
          {
            headers: {
              Authorization: `Bearer ${this.paymentConfig.token}`,
            },
          }
        )
        .pipe(map((res) => res.data.Data.PaymentMethods))
    );
  }
}
