import { InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from 'src/common/order/order';

export enum TagOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  active = 'active',
  title = 'title',
  title_ar = 'title_ar',
}

registerEnumType(TagOrderField, {
  name: 'TagOrderField',
  description: 'Properties by which tag connections can be ordered.',
});

@InputType()
export class TagOrder extends Order {
  field: TagOrderField;
}
