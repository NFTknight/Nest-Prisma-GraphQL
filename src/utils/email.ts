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
        text: 'Order has been confirmed',
        html: '<p>Order has been confirmed</p>',
      };
    case ORDER_OPTIONS.REJECTED:
      return {
        ...mail,
        subject: 'Order rejection',
        text: 'order has been rejected',
        html: '<p>order has been rejected</p>',
      };
    case ORDER_OPTIONS.PURCHASED:
      return {
        ...mail,
        subject: 'Order placement',
        text: 'Your Order has been sent to vendor',
        html: '<p>Your Order has been sent to vendor</p>',
      };
    case ORDER_OPTIONS.RECEIVED:
      return {
        ...mail,
        subject: 'Order placement',
        text: 'You have an Order',
        html: '<p>You have an Order</p>',
      };
    case EMAIL_OPTIONS.WELCOME_VENDOR:
      return {
        ...mail,
        subject: 'Order placement',
        text: 'You have an Order',
        html: '<p>You have an Order</p>',
      };
    case EMAIL_OPTIONS.FORGOT_PWT:
      return {
        ...mail,
        subject: 'Forgot Password',
        text: 'You have an Order',
        html: body,
      };
    case EMAIL_OPTIONS.AMOUNT_REFUND:
      return {
        ...mail,
        subject: 'Order placement',
        text: 'You have an Order',
        html: '<p>You have an Order</p>',
      };
    case EMAIL_OPTIONS.REVIEW_PRODUCT:
      return {
        ...mail,
        subject: 'Order placement',
        text: 'You have an Order',
        html: '<p>You have an Order</p>',
      };
    default:
      break;
  }
};
