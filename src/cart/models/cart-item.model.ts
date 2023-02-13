import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { BookingTime } from 'src/bookings/models/booking-time.model';
import { Product } from 'src/products/models/product.model';
import { Tag } from 'src/tags/models/tag.model';

@ObjectType()
export class CartItem {
  @Field()
  @IsNotEmpty()
  productId: string;

  @Field()
  @IsNotEmpty()
  sku: string;

  @Field(() => Float)
  @IsNotEmpty()
  price: number;

  @Field({ nullable: true })
  answers: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  title_ar?: string;

  @Field(() => Int)
  quantity: number;

  @Field({ nullable: true })
  tagId: string;

  @Field({ nullable: true })
  Tag?: Tag;

  @Field({ defaultValue: false, nullable: true })
  expired: boolean;

  @Field(() => [BookingTime], { nullable: true })
  slots: BookingTime[];

  @Field(() => Product)
  product?: Product;
}
