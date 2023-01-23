import { InputType, Field } from '@nestjs/graphql';
import { DeliveryMethods, PaymentMethods, OrderStatus } from '@prisma/client';
import { WayBillItem } from 'src/shipping/models/waybill.model';

@InputType()
export class UpdateOrderInput {
  @Field(() => OrderStatus)
  status?: OrderStatus;

  @Field()
  vendorId?: string;

  @Field()
  cartId?: string;

  @Field(() => PaymentMethods)
  paymentMethod?: PaymentMethods;

  @Field(() => DeliveryMethods)
  deliveryMethod?: DeliveryMethods;
}

@InputType()
export class AddressEntity {
  ContactName: string;
  ContactPhoneNumber: string;
  Country: string;
  City: string;
  AddressLine1: string;
}

@InputType()
export class CreateShipmentInput {
  OrderNumber: string;
  DeclaredValue: number;
  CODAmount: number;
  Parcels: number;
  ShipDate: string;
  ShipmentCurrency: string;
  Weight: number;
  WeightUnit: string;
  WaybillType: string;
  ContentDescription: string;

  @Field(() => AddressEntity)
  ConsigneeAddress?: AddressEntity;
  ShipperAddress: AddressEntity;
}
export class CreateShipmentResponse {
  sawb: string;
  createDate: string;
  shipmentParcelsCount: number;

  @Field(() => [WayBillItem])
  waybills: WayBillItem[];
}
