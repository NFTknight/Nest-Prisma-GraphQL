import { InputType } from '@nestjs/graphql';

@InputType()
export class FilterInput {
  field: string;
  value: string;
}
