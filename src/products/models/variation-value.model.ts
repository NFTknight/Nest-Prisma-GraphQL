import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VariationValue {
  value: string;

  value_ar: string;
}
