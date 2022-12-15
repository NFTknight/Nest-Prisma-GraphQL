import { InputType } from '@nestjs/graphql';
import { VariantsOptions as VariantsOptionsTypes } from 'prisma/prisma-client';
@InputType()
export class VariantsOptions implements VariantsOptionsTypes {
  title: string;
  title_ar: string;
  sku: string;
  price: number;
  image: string;
}
