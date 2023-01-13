import { Field, ObjectType } from '@nestjs/graphql';
import { Certificate, VendorInfo as PrismaVendorInfo } from '@prisma/client';
import { Location } from 'src/products/models/product.model';

@ObjectType()
class Certificates {
  title: string;
  image: string;
}

@ObjectType()
export class VendorInfo implements PrismaVendorInfo {
  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  addressUrl: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  description_ar: string;

  @Field({ nullable: true })
  heroImage: string;

  @Field({ nullable: true })
  logo: string;

  @Field({ nullable: true })
  terms: string;

  @Field(() => Location, { nullable: true })
  location: Location;

  @Field(() => [Certificates], { nullable: true })
  certificates: Certificate[];

  @Field({ nullable: true })
  instagram: string;

  @Field({ nullable: true })
  facebook: string;

  @Field({ nullable: true })
  snapchat: string;

  @Field({ nullable: true })
  whatsapp: string;

  @Field({ nullable: true })
  vatNum: string;

  @Field({ nullable: true })
  crNum: string;

  @Field({ nullable: true })
  maroofNum: string;

  @Field({ nullable: true })
  freelanceNum: string;
}
