import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VendorFilterInput {
  @Field(() => [String], { nullable: true })
  name: [string];

  @Field(() => [String], { nullable: true })
  name_ar: string;

  @Field(() => Boolean, { nullable: true })
  active: boolean;
}
