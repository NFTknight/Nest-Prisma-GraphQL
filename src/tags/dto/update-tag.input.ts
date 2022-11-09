import { InputType, Field } from '@nestjs/graphql';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';

@InputType()
export class UpdateTagInput {
  @Field()
  title?: string;

  @Field()
  title_ar?: string;

  @Field()
  active?: boolean;

  @Field(() => [ServiceAvailabilityInput])
  availabilities?: ServiceAvailabilityInput[];
}
