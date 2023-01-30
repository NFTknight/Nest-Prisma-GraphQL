import { SortOrder } from 'src/common/sort-order/sort-order.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { ProductFilterInput } from 'src/common/filter/filter.input';

export interface GetProductArgs {
  vendorId?: string;
  categoryId?: string;
  pg?: PaginationArgs;
  sortOrder?: SortOrder;
  filter?: ProductFilterInput;
}
