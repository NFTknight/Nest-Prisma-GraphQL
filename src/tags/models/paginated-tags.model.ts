import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Tag } from './tag.model';

@ObjectType()
export class PaginatedTags extends paginated(Tag) {}
