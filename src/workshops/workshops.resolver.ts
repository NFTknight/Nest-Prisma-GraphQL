import { Args, Query, Resolver } from '@nestjs/graphql';
import { Workshop } from './models/workshop.model';
import { WorkshopService } from './workshops.service';

@Resolver(() => Workshop)
export class WorkshopResolver {
  constructor(private readonly workshopServices: WorkshopService) {}

  @Query(() => Workshop)
  getWorkshop(@Args('id') id: string): Promise<Workshop | null> {
    return this.workshopServices.getWorkshop(id);
  }
  @Query(() => Workshop)
  createWorkshop(
    @Args('productId') productId: string,
    @Args('cartId') cartId: string
  ): Promise<Workshop | null> {
    return this.workshopServices.createWorkshop({ productId, cartId });
  }
}
