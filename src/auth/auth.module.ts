import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { SmsModule } from 'src/sms/sms.module';
import { GqlGuardIsAdmin } from './gql-signup.guard';
import { UsersService } from 'src/users/users.service';
import { VendorsService } from 'src/vendors/vendors.service';
import { SendgridService } from 'src/sendgrid/sendgrid.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    SmsModule,
  ],
  providers: [
    AuthService,
    VendorsService,
    SendgridService,
    UsersService,
    AuthResolver,
    JwtStrategy,
    GqlAuthGuard,
    GqlGuardIsAdmin,
    PasswordService,
  ],
  exports: [GqlAuthGuard, GqlGuardIsAdmin],
})
export class AuthModule {}
