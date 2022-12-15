import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/common/models/base.model';
import { VariantOptions } from './variant-options.model';
@ObjectType()
export class VariantModel extends BaseModel {
  title: string;
  title_ar: string;

  @Field(() => [VariantOptions])
  options?: VariantOptions[];
}
