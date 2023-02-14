import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';
import { MetaDetailsInput } from 'src/vendors/dto/update-vendor.input';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  title_ar: string;

  @Field()
  @IsNotEmpty()
  vendorId: string;

  @Field()
  @IsNotEmpty()
  active: boolean;

  @Field()
  slug?: string;

  @Field(() => Int)
  sortOrder?: number;

  @Field(() => MetaDetailsInput, { nullable: true })
  meta?: MetaDetailsInput;
}
