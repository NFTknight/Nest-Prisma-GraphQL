import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class PaginatedUsers extends paginated(User) {}
