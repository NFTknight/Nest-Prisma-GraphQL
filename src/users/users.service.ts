import { PrismaService } from 'nestjs-prisma';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from 'src/auth/password.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SmsService } from 'src/sms/sms.service';
import { OtpStatusCode } from 'src/sms/models/check-otp.model';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private readonly sms: SmsService,
    private readonly vendorService: VendorsService
  ) {}

  async updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  async verifyOtp(phone: string, otp: string, userId: string) {
    const response = await this.sms.verifyOtp(phone, otp);

    if (response.status === OtpStatusCode.CORRECT) {
      await this.prisma.user.update({
        data: {
          phone: phone,
          verified: true,
        },
        where: { id: userId },
      });
    }

    return response;
  }
}
