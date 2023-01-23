import { registerEnumType } from '@nestjs/graphql';
import { SubscriptionPlan, SubscriptionType } from 'prisma/prisma-client';

registerEnumType(SubscriptionPlan, {
  name: 'SubscriptionPlan',
  description: 'Subscription Plan',
});

registerEnumType(SubscriptionType, {
  name: 'SubscriptionType',
  description: 'Subscription Type',
});
