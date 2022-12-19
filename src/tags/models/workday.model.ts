import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Weekday } from '@prisma/client';

@ObjectType()
@InputType('WorkDayInput')
export class WorkDay {
  @Field(() => Weekday)
  day: Weekday;

  @Field()
  from: string;

  @Field()
  to: string;
}
