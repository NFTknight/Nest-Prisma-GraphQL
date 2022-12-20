import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateFormInput {
  content: string;
  vendorId: string;
}

@InputType()
export class UpdateFormInput extends PartialType(CreateFormInput) {}
