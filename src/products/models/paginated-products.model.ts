import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Product } from './product.model';

@ObjectType()
export class PaginatedProducts extends paginated(Product) {}
