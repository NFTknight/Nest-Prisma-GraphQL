import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { SmsConfig } from 'src/common/configs/config.interface';
import { StartVerificationApiInput } from './dto/start.dto';
import {
  CheckOtpApiResponse,
  CheckVerificationApiInput,
} from './dto/verify.dto';
import { CheckOtpResponse } from './models/check-otp.model';
import { OtpResponse } from './models/otp.model';

@Injectable()
export class SmsService {
  private readonly smsConfig: SmsConfig;
  private readonly logger = new Logger(SmsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.smsConfig = this.configService.get<SmsConfig>('sms');
  }

  sendOtp(phone: string) {
    const input: StartVerificationApiInput = {
      to: phone,
      channel: this.smsConfig.defaultChannel,
      locale: this.smsConfig.defaultLocale,
      length: this.smsConfig.defaultLength,
    };

    const url = `${this.smsConfig.otpUrl}/services/api/v2/verifications/start`;

    return this.httpService
      .post<OtpResponse>(url, input, {
        headers: {
          Authorization: `Bearer ${this.smsConfig.otpToken}`,
          'x-authenticate-app-id': this.smsConfig.otpAppId,
        },
      })
      .pipe(map((res) => res.data));
  }

  verifyOtp(phone: string, code: string): Promise<CheckOtpResponse> {
    const input: CheckVerificationApiInput = {
      to: phone,
      code,
      channel: this.smsConfig.defaultChannel,
    };

    const url = `${this.smsConfig.otpUrl}/services/api/v2/verifications/check`;
    return firstValueFrom(
      this.httpService
        .post<CheckOtpApiResponse>(url, input, {
          headers: {
            Authorization: `Bearer ${this.smsConfig.otpToken}`,
            'x-authenticate-app-id': this.smsConfig.otpAppId,
          },
        })
        .pipe(
          map((res) => {
            const data = new CheckOtpResponse();
            data.id = res.data.id;
            data.to = res.data.to;
            data.status = res.data.error_code;
            return data;
          })
        )
    );
  }
}
