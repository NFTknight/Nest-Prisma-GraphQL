import { InputType } from '@nestjs/graphql';

import { ProductAttribute as PAttribute } from 'prisma/prisma-client';

@InputType()
export class ProductAttributeInput implements PAttribute {
  key: string;
  key_ar: string;
  value: string;
  value_ar: string;
}
