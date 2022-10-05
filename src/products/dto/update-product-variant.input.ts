import { InputType, Field, Int } from '@nestjs/graphql';
import { ProductAttributeInput } from './product-attribute.input';

@InputType()
export class UpdateProductVariantInput {
  @Field()
  sku?: string;

  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  description?: string;

  @Field()
  description_ar?: string;

  @Field()
  previewImage?: string;

  @Field()
  image?: string;

  @Field()
  active?: boolean;

  @Field(() => Int)
  price?: number;

  @Field(() => Int)
  price_ar?: number;

  @Field()
  productId?: string;

  @Field(() => [ProductAttributeInput])
  attributes?: ProductAttributeInput[];
}
