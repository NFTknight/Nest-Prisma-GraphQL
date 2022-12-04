import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { InitiatePaymentInput } from './dto/initiate-payment.input';
import { PaymentMethod } from './models/payment-method.model';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => [PaymentMethod])
  async initiatePayment(
    @Args('data') { amount, currency }: InitiatePaymentInput
  ) {
    return this.paymentService.initiatePayment(amount, currency);
  }
}
