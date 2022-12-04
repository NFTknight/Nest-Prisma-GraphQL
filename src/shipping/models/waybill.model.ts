import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class WayBillItem {
  awb: string;
  awbFile: string;
}

@ObjectType()
export class WayBill {
  sawb: string;
  createDate: string;
  shipmentParcelsCount: number;

  @Field(() => [WayBillItem])
  waybills: WayBillItem[];
}
