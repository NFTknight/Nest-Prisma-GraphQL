import { ObjectType } from '@nestjs/graphql';

import { ProductAttribute as PAttribute } from 'prisma/prisma-client';

@ObjectType()
export class ProductAttribute implements PAttribute {
  key: string;
  key_ar: string;
  value: string;
  value_ar: string;
}
