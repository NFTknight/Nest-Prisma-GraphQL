import { Field, ObjectType } from '@nestjs/graphql';
import { Cart } from 'src/cart/models/cart.model';
import { BaseModel } from 'src/common/models/base.model';
import { Workshop as PrismaWorkshop } from 'prisma/prisma-client';

@ObjectType()
export class Workshop extends BaseModel implements PrismaWorkshop {
  @Field(() => String, { nullable: true })
  cartId: string;
  @Field(() => String, { nullable: true })
  productId: string;
}
