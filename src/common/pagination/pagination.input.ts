import { InputType } from '@nestjs/graphql';

@InputType()
export class PaginationArgs {
  page?: number;
  pageSize?: number;
}
