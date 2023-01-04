export type RefundPaymentApiRequest = {
  Key: string;
  KeyType: string;
  RefundChargeOnCustomer: boolean;
  ServiceChargeOnCustomer: boolean;
  Amount: number;
  Comment: string;
  AmountDeductedFromSupplier?: number;
};

export type SupplierRefundPaymentApiRequest = {
  Key: string;
  KeyType: string;
  VendorDeductAmount: number;
  Comment: string;
  Suppliers: [RefundSupplier];
};

type RefundSupplier = {
  SupplierCode: number;
  SupplierDeductedAmount?: number;
};
