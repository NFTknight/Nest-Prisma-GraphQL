export type RefundPaymentApiRequest = {
  Key: string;
  KeyType: string;
  RefundChargeOnCustomer: boolean;
  ServiceChargeOnCustomer: boolean;
  Amount: number;
  Comment: string;
  AmountDeductedFromSupplier?: number;
};
