import { IsNotEmpty } from 'class-validator';
import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { WorkDay } from '../models/workday.model';
import { Weekday } from '@prisma/client';

registerEnumType(Weekday, {
  name: 'Weekday',
});

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

  @Field(() => [WorkDay])
  workdays: WorkDay[];

  @Field(() => [String], { nullable: true })
  productIds: string[];
}
