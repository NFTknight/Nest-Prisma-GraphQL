import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddDeliveryAreasInput {
  @Field()
  label: string;

  @Field()
  label_ar: string;

  @Field()
  active: boolean;

  @Field()
  charge: number;
}
