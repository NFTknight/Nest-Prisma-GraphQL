import { Args, Query, Resolver } from '@nestjs/graphql';
import { ShippingOffice } from './models/offices.model';
import { ShippingService } from './shipping.service';

@Resolver()
export class ShippingResolver {
  constructor(private readonly shippingService: ShippingService) {}

  @Query(() => [ShippingOffice])
  async shippingOffices(
    @Args('city', {
      nullable: true,
    })
    city?: string
  ): Promise<ShippingOffice[]> {
    return this.shippingService.getShippingOffices(city);
  }
}
