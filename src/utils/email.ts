import { OrderStatus } from '@prisma/client';

const fromEmail = 'info@anyaa.io';

export const ORDER_OPTIONS = {
  CONFIRMED: OrderStatus.CONFIRMED,
  REJECTED: OrderStatus.REJECTED,
  PURCHASED: 'PURCHASED',
  RECEIVED: 'RECEIVED',
};

export const EMAIL_OPTIONS = {
  WELCOME_VENDOR: 'WELCOME_VENDOR',
  FORGOT_PWT: 'FORGOT_PWD',
  AMOUNT_REFUND: 'AMOUNT_REFUND',
  REVIEW_PRODUCT: 'REVIEW_PRODUCT',
};

export const SendEmails = (type: string, toEmail: string, body?: string) => {
  const mail = { to: toEmail, from: fromEmail };

  switch (type) {
    case ORDER_OPTIONS.CONFIRMED:
      return {
        ...mail,
        subject: 'Order confirmation',
        templateId: 'd-b097c196b7f4413682a7f8011af9b75a',
      };
    case ORDER_OPTIONS.REJECTED:
      return {
        ...mail,
        subject: 'Order rejection',
        templateId: 'd-b93a7846c6834322a0f748c8f39dc02a',
      };
    case ORDER_OPTIONS.PURCHASED:
      return {
        ...mail,
        subject: 'Order placement',
        templateId: 'd-8fa0268372694f7a9fb62c384a590bb5',
      };
    case ORDER_OPTIONS.RECEIVED:
      return {
        ...mail,
        subject: 'Order placement',
        templateId: 'd-6231e2095f4e4feb9a1671b7c8294459',
      };
    case EMAIL_OPTIONS.WELCOME_VENDOR:
      return {
        ...mail,
        subject: 'Order placement',
        html: '<p>You have an Order</p>',
      };
    case EMAIL_OPTIONS.FORGOT_PWT:
      return {
        ...mail,
        subject: 'Forgot Password',
        html: body,
      };
    case EMAIL_OPTIONS.AMOUNT_REFUND:
      return {
        ...mail,
        subject: 'Order placement',
        html: '<p>You have an Order</p>',
      };
    case EMAIL_OPTIONS.REVIEW_PRODUCT:
      return {
        ...mail,
        subject: 'Order placement',
        html: '<p>You have an Order</p>',
      };
    default:
      break;
  }
};
