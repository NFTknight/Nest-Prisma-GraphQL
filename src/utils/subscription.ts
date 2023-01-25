import { SubscriptionType, SubscriptionPlan } from '@prisma/client';

export const getSubscriptionPrice = (
  type: SubscriptionType,
  plan: SubscriptionPlan
) => {
  let price = 0; // price in case of free_life plan
  const basic = 200;
  const basic_lite = 20; // with 6% commission

  if (plan === SubscriptionPlan.BASIC) {
    price = calcPrice(basic, type);
  } else if (plan === SubscriptionPlan.BASIC_LITE) {
    price = calcPrice(basic_lite, type);
  }
  return price;
};

const calcPrice = (amount: number, type: SubscriptionType) => {
  const yearly = amount * 12;
  const discount = 0.15 * yearly; // 15% of yearly in case of yearly subscription
  return type === SubscriptionType.MONTHLY ? amount : yearly - discount;
};
