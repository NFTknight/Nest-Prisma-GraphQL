import { InputType, Field } from '@nestjs/graphql';
import { VariantOptionsInput } from 'src/variants/dto/variant-options.input';

@InputType()
export class ProductVariantInput {
  @Field()
  id: string;

  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field(() => [VariantOptionsInput])
  options?: VariantOptionsInput[];
}
