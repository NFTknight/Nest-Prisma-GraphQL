import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { VariantsOptions } from './variant-options.input';
@InputType()
export class CreateVariantInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  identifier: string;

  @Field()
  @IsNotEmpty()
  title_ar: string;

  @Field(() => [VariantsOptions])
  options?: VariantsOptions[];
}
