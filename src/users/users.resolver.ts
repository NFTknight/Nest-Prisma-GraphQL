import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { SmsService } from 'src/sms/sms.service';
import { SendOtpInput } from './dto/send-otp.input';
import { CheckOtpInput } from './dto/check-otp.input';
import { OtpResponse } from 'src/sms/models/otp.model';
import { CheckOtpResponse } from 'src/sms/models/check-otp.model';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private readonly sms: SmsService,
    private prisma: PrismaService,
    private readonly vendorService: VendorsService
  ) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => OtpResponse)
  async sendOtp(@Args('data') { phone }: SendOtpInput) {
    return this.sms.sendOtp(phone);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CheckOtpResponse)
  async verifyOtp(
    @UserEntity() user: User,
    @Args('data') { phone, code }: CheckOtpInput
  ) {
    return this.usersService.verifyOtp(phone, code, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @ResolveField('vendor')
  vendor(@Parent() user: User): Promise<Vendor> {
    return this.vendorService.getVendorByUserId(user.id);
  }
}
