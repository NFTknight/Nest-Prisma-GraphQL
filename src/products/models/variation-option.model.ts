import { Field, ObjectType } from '@nestjs/graphql';
import { VariationValue } from './variation-value.model';

@ObjectType()
export class VariationOption {
  key: string;

  key_ar: string;

  @Field(() => [VariationValue], { nullable: true })
  values: VariationValue[];
}
