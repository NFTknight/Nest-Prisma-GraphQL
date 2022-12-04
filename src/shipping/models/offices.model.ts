import { Field, ObjectType } from '@nestjs/graphql';
import { Coordinates } from 'src/common/models/coordinates.model';

@ObjectType()
export class ShippingOffice {
  code: string;
  address: string;
  cityName: string;
  addressAR: string;

  @Field(() => Coordinates)
  coordinates: Coordinates;

  firstShift: string;
  secondShift: string;
  weekendShift: string;
}
