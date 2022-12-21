import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { CartItem } from './cart-item.model';
import { Cart as ICart } from '@prisma/client';

@ObjectType()
export class Cart extends BaseModel implements ICart {
  @Field(() => [CartItem])
  items: CartItem[];

  @Field()
  customerId: string;

  @Field({ nullable: true })
  appliedCoupon: string;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => Float)
  finalPrice: number;

  @Field()
  vendorId: string;
}
