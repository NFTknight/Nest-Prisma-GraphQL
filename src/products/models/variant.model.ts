import { ObjectType, PickType } from '@nestjs/graphql';
import { VariantModel } from 'src/variants/models/variant.model';

@ObjectType()
export class Variant extends PickType(VariantModel, [
  'id',
  'title',
  'title_ar',
  'options',
]) {}
