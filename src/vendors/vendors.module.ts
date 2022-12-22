import { Module } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { SendgridModule } from 'src/sendgrid/sendgrid.module';
import { VendorsResolver } from './vendors.resolver';
import { VendorsService } from './vendors.service';

@Module({
  imports: [SendgridModule],
  providers: [VendorsResolver, VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}

@ObjectType()
export class VendorView {
  @Field(() => Int)
  numberProducts: number;

  @Field(() => Int)
  numberOrders?: number;

  @Field(() => Int)
  numberServices?: number;

  @Field(() => Int)
  numberBookings?: number;

  @Field(() => Int)
  numberCategories?: number;

  @Field(() => Int)
  numberCoupons?: number;

  @Field(() => String)
  accountManager?: string;
}
