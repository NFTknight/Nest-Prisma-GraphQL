import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { ServiceAvailabilityInput } from 'src/common/dto/service-availability.input';
@InputType()
export class CreateTagInput {
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

  @Field(() => [ServiceAvailabilityInput])
  availabilities?: ServiceAvailabilityInput[];
}
