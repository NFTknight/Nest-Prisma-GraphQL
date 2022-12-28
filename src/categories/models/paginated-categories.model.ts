import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Category } from './category.model';

@ObjectType()
export class PaginatedCategories extends paginated(Category) {}
