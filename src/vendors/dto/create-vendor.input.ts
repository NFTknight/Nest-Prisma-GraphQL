import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateVendorInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  name_ar?: string;

  @Field()
  @IsNotEmpty()
  slug: string;
}
