import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetPaymentStatusResponse {
  InvoiceId: number;
  InvoiceStatus: string;
  InvoiceReference: string;
  CustomerReference: string;
  CreatedDate: string;
  ExpiryDate: string;
  ExpiryTime: string;
  InvoiceValue: number;
  Comments: string;
  CustomerName: string;
  CustomerMobile: string;
  CustomerEmail: string;
  UserDefinedField: string;
  InvoiceDisplayValue: string;
  DueDeposit: number;
  DepositStatus: string;
  InvoiceItems: InvoiceItemModel[];
  InvoiceTransactions: TransactionModel[];
  Suppliers: SupplierModel[];
}

@ObjectType()
export class InvoiceItemModel {
  ItemName: string;
  Quantity: number;
  UnitPrice: number;
  Weight?: number;
  Width?: number;
  Height?: number;
  Depth?: number;
}

@ObjectType()
export class TransactionModel {
  TransactionDate: string;
  PaymentGateway: string;
  ReferenceId: string;
  TrackId: string;
  TransactionId: string;
  PaymentId: string;
  AuthorizationId: string;
  TransactionStatus: string;
  TransationValue: string;
  CustomerServiceCharge: string;
  DueValue: string;
  PaidCurrency: string;
  PaidCurrencyValue: string;
  IpAddress: string;
  Country: string;
  Currency: string;
  Error: string;
  CardNumber: string;
  ErrorCode: string;
}

@ObjectType()
export class SupplierModel {
  SupplierCode: number;
  SupplierName: string;
  InvoiceShare: number;
  ProposedShare: number;
  DepositShare: number;
}
