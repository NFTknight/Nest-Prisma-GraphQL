import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class LocationInput {
  address: string;
  url: string;
  @Field(() => Float)
  lat: number;
  @Field(() => Float)
  lng: number;
}
