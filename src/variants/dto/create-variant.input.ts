import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { VariantOptionsInput } from './variant-options.input';
@InputType()
export class CreateVariantInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  @IsNotEmpty()
  title_ar: string;

  @Field(() => [VariantOptionsInput])
  options?: VariantOptionsInput[];
}
