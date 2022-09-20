import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VendorsService } from './vendors.service';
import { Vendor } from './models/vendor.model';
import { CreateVendorInput } from './dto/createVendor.input';

@Resolver(() => Vendor)
export class VendorsResolver {
  constructor(private vendorsService: VendorsService) {}

  @Query(() => [Vendor])
  async getVendors(): Promise<Vendor[]> {
    return await this.vendorsService.getVendors();
  }

  @Query(() => Vendor)
  async getVendor(@Args('id') id: string): Promise<Vendor> {
    return await this.vendorsService.getVendor(id);
  }

  @Mutation(() => Vendor)
  async createVendor(@Args('data') data: CreateVendorInput): Promise<Vendor> {
    return await this.vendorsService.createVendor(data);
  }

  @Mutation(() => Vendor)
  async updateVendor(
    @Args('id') id: string,
    @Args('data') data: CreateVendorInput
  ): Promise<Vendor> {
    return await this.vendorsService.updateVendor(id, data);
  }

  @Mutation(() => Vendor)
  async deleteVendor(@Args('id') id: string): Promise<Vendor> {
    return await this.vendorsService.deleteVendor(id);
  }
}
