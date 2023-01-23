import { Args, Query, Resolver } from '@nestjs/graphql';
import { UpdateWorkshopInput } from './dto/update.workshops.input';
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
    @Args('cartId') cartId: string,
    @Args('quantity') quantity: number
  ): Promise<Workshop | null> {
    return this.workshopServices.createWorkshop({
      productId,
      cartId,
      quantity,
    });
  }

  @Query(() => Workshop)
  updateWorkshop(
    @Args('id') id: string,
    @Args('data') data: UpdateWorkshopInput
  ): Promise<Workshop | null> {
    return this.workshopServices.updateWorkshop(id, data);
  }
}
