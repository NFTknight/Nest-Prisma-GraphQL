import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VariantOptions {
  title: string;
  title_ar: string;
  sku: string;
  image: string;
}
