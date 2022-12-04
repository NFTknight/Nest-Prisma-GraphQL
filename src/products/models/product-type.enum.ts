import { registerEnumType } from '@nestjs/graphql';
import { ProductType } from 'prisma/prisma-client';

registerEnumType(ProductType, {
  name: 'ProductType',
  description: 'Product Type',
});
