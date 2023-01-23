import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { AddSubscriptionInput } from './add-subscription-input';

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

  @Field(() => AddSubscriptionInput, { nullable: true })
  subscription?: AddSubscriptionInput;
}
