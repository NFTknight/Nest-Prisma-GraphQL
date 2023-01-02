import { PrismaService } from 'nestjs-prisma';
import { Prisma, Role, User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupInput } from './dto/signup.input';
import { SmsService } from 'src/sms/sms.service';
import { OtpStatusCode } from 'src/sms/models/check-otp.model';
import { Token } from './models/token.model';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { SendgridService } from 'src/sendgrid/sendgrid.service';
import { EMAIL_OPTIONS, SendEmails } from 'src/utils/email';
import { ResetPwtInput } from './dto/reset-pwd.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sms: SmsService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly emailService: SendgridService
  ) {}

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          role: Role.VENDOR,
        },
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(`Email ${payload.email} already used.`);
      }
      throw new Error(e);
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  async phoneVerify(phone: string, code: string): Promise<Token> {
    const response = await this.sms.verifyOtp(phone, code);
    if (response.status === OtpStatusCode.CORRECT) {
      await this.prisma.user.updateMany({
        data: {
          phone: phone,
          verified: true,
        },
        where: { phone: phone },
      });
    } else
      throw new UnauthorizedException(
        `Your OPT is incorrect for the phone: ${phone}`
      );
    const user = await this.prisma.user.findFirst({ where: { phone } });

    return this.generateTokens({
      userId: user.id,
    });
  }

  validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async validatePhone(phone: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({ where: { phone } });
    if (user) return true;
    else return false;
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException('refresh Token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);
    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: user.password, expiresIn: '1h' } // using old hashed password as a secret make it one time token
    );
    const body = `<p>
    <p>This link will expire in 1 hour</p><br/>
    <a href="https://portal.dev.anyaa.io/auth/resetPwd/?token=${token}">click on the link to reset your password</a></p>`;
    this.emailService.send(
      SendEmails(EMAIL_OPTIONS.FORGOT_PWT, user.email, body)
    );
    return user;
  }

  async resetPassword(payload: ResetPwtInput) {
    try {
      const { token, password } = payload;
      const hashedPwd = await this.passwordService.hashPassword(password);
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) throw new BadRequestException('Invalid token');
      const id = decodedToken['userId']; // to get user id for current hash password for token verification

      const user = await this.prisma.user.findUnique({ where: { id } });
      if (user?.password) {
        this.jwtService.verify(token, { secret: user.password }); // verify token using old password hash
        const updatedUser = await this.prisma.user.update({
          data: { password: hashedPwd },
          where: {
            id,
          },
        });
        if (!updatedUser) throw new Error('Unable to update password');
        return { success: true, message: 'Password updated successfully' };
      } else throw new Error('Unable to update password');
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}
