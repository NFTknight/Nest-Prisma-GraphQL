import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coordinates {
  @Field(() => Float, { nullable: false })
  lat: number;

  @Field(() => Float, { nullable: false })
  lng: number;
}
