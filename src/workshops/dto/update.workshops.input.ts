import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateWorkshopInput {
  @Field()
  quantity: number;
}
