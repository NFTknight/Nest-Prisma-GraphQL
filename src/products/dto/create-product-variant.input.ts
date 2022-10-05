import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductAttributeInput } from './product-attribute.input';
@InputType()
export class CreateProductVariantInput {
  @Field()
  @IsNotEmpty()
  sku: string;

  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  title_ar: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  description_ar: string;

  @Field()
  @IsNotEmpty()
  previewImage: string;

  @Field()
  @IsNotEmpty()
  image: string;

  @Field()
  @IsNotEmpty()
  active: boolean;

  @Field(() => Int)
  @IsNotEmpty()
  price: number;

  @Field(() => Int)
  @IsNotEmpty()
  price_ar: number;

  @Field()
  @IsNotEmpty()
  productId: string;

  @Field(() => [ProductAttributeInput])
  @IsNotEmpty()
  attributes: ProductAttributeInput[];
}
