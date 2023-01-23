import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { PaymentSession } from './models/payment-session.model';
import { GetPaymentStatusResponse } from './models/payment-status.model';
import { RefundPaymentAPIResponse } from './models/refund-payment.model';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentSession)
  async initiatePaymentSession() {
    const res = await this.paymentService.initiateSession();
    return res;
  }

  @Query(() => GetPaymentStatusResponse)
  getOrderPaymentStatus(@Args('orderId') orderId: string) {
    return this.paymentService.checkPaymentStatus(orderId);
  }

  @Mutation(() => RefundPaymentAPIResponse)
  refundPayment(@Args('orderId') orderId: string) {
    return this.paymentService.refundPayment(orderId);
  }

  @Mutation(() => RefundPaymentAPIResponse)
  supplierRefundPayment(@Args('orderId') orderId: string) {
    return this.paymentService.supplierRefundPayment(orderId);
  }

  @Query(() => RefundPaymentAPIResponse)
  getRefundPaymentStatus(@Args('invoiceId') invoiceId: string) {
    return this.paymentService.checkRefundPaymentStatus(invoiceId);
  }
}
