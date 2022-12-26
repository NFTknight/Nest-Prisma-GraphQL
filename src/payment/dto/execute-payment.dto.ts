export type ExecutePaymentApiRequest = {
  SessionId: string;
  InvoiceValue: number;
  CustomerName: string;
  DisplayCurrencyIso: string;
  MobileCountryCode?: string;
  CustomerMobile?: string;
  CustomerEmail: string;
  CallBackUrl: string;
  ErrorUrl?: string;
  Language?: string;
  CustomerReference: string;
  CustomerAddress?: {
    Block: string;
    Street: string;
    HouseBuildingNo: string;
    AddressInstructions: string;
  };
  InvoiceItems?: Array<{
    ItemName: string;
    Quantity: number;
    UnitPrice: number;
    Weight?: number;
    Width?: number;
    Height?: number;
    Depth?: number;
  }>;
};
