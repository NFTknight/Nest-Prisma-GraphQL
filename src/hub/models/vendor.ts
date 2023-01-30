import { ObjectType } from '@nestjs/graphql';
import paginated from 'src/common/pagination/pagination';
import { Vendor } from 'src/vendors/models/vendor.model';

@ObjectType()
export class PaginatedVendors extends paginated(Vendor) {}
