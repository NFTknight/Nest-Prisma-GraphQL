import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { PaymentSession } from './models/payment-session.model';
import { GetPaymentStatusResponse } from './models/payment-status.model';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentSession)
  async initiatePaymentSession() {
    const res = await this.paymentService.initiateSession();
    console.log(res);
    return res;
  }

  @Query(() => GetPaymentStatusResponse)
  async getPaymentStatus(@Args('orderId') orderId: string) {
    return this.paymentService.checkPaymentStatus(orderId);
  }
}
