import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput {
  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field(() => [String])
  tagIds?: string[];

  @Field()
  active?: boolean;

  @Field(() => Int)
  sortOrder?: number;
}
