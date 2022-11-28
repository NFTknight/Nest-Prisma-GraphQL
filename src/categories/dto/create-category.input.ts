import { IsNotEmpty } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

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

  @Field(() => [String], { nullable: false })
  tagIds: string[];

  @Field()
  @IsNotEmpty()
  active: boolean;

  @Field(() => Int)
  sortOrder: number;
}
