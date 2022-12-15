import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { PaymentConfig } from 'src/common/configs/config.interface';
import { PaymentSession } from './models/payment-session.model';

@Injectable()
export class PaymentService {
  private readonly paymentConfig: PaymentConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService
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
}
