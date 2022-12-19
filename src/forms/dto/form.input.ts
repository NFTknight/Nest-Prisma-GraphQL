import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateFormInput {
  content: string;
  vendorId: string;
}

@InputType()
export class UpdateFormInput {
  content?: string;
  vendorId?: string;
}
