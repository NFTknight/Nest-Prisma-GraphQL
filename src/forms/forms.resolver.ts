import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Vendor } from 'src/vendors/models/vendor.model';
import { VendorsService } from 'src/vendors/vendors.service';
import { CreateFormInput } from './dto/form.input';
import { UpdateFormInput } from './dto/form.input';
import { PaginationArgs } from 'src/common/pagination/pagination.input';
import { FormService } from './forms.service';
import { Form } from './models/forms.model';

@Resolver(() => Form)
export class FormResolver {
  constructor(
    private readonly formService: FormService,
    private readonly vendorService: VendorsService
  ) {}

  @Query(() => Form)
  getForm(@Args('id') id: string): Promise<Form> {
    return this.formService.getForm(id);
  }

  @Query(() => [Form])
  async getForms(
    @Args('vendorId', { nullable: true }) vendorId: string,
    @Args('pagination', { nullable: true }) pg?: PaginationArgs
  ) {
    try {
      const orders = this.formService.getForms(vendorId, pg);

      return orders;
    } catch (err) {
      console.log('something went wrong', err);
      return [];
    }
  }

  @Mutation(() => Form)
  createForm(@Args('data') data: CreateFormInput): Promise<Form> {
    return this.formService.createForm(data);
  }

  @Mutation(() => Form)
  updateForm(
    @Args('id') id: string,
    @Args('data') data: UpdateFormInput
  ): Promise<Form> {
    return this.formService.updateForm(id, data);
  }

  @Mutation(() => Form)
  deleteForm(@Args('id') id: string): Promise<Form> {
    return this.formService.deleteForm(id);
  }

  @ResolveField('vendor')
  vendor(@Parent() order: Form): Promise<Vendor> {
    return this.vendorService.getVendor(order.vendorId);
  }
}
