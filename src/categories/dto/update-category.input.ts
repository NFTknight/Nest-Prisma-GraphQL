import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput {
  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  vendorId?: string;

  @Field()
  active?: boolean;
}
