import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { Workshop as PrismaWorkshop } from 'prisma/prisma-client';

@ObjectType()
export class Workshop extends BaseModel implements PrismaWorkshop {
  @Field(() => String, { nullable: true })
  cartId: string;
  @Field(() => String, { nullable: true })
  productId: string;
  @Field(() => Int, { defaultValue: 1 })
  quantity: number;
}
