import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { PhoneLoginInput } from './dto/phone-login.input';
import { PhoneVerify } from './dto/phone-verify.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { SmsService } from 'src/sms/sms.service';
import { OtpResponse } from 'src/sms/models/otp.model';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './gql-signup.guard';
import { Role } from '@prisma/client';
import { UserRole } from './models/user.role.model';
import { UsersService } from 'src/users/users.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly auth: AuthService,
    private readonly sms: SmsService,
    private readonly usersService: UsersService
  ) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async createUser(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      email.toLowerCase(),
      password
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => OtpResponse)
  async phoneLogin(@Args('data') { phone }: PhoneLoginInput) {
    const phoneValid = await this.auth.validatePhone(phone);
    if (phoneValid) {
      return this.sms.sendOtp(phone);
    } else return null;
  }

  @Mutation(() => Auth)
  async verifyPhone(@Args('data') { phone, code }: PhoneVerify) {
    const { accessToken, refreshToken } = await this.auth.phoneVerify(
      phone,
      code
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('role', Role.ADMIN)
  @Mutation(() => UserRole)
  async updateUserRole(
    @Args({ name: 'userId', type: () => String }) userId: string,
    @Args({ name: 'role', type: () => Role }) role: Role
  ) {
    await this.usersService.updateUserRole(userId, role);
    return { userId, role };
  }

  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
