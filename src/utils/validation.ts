import { ProductType, AttendanceType } from '@prisma/client';
import { CreateProductInput } from 'src/products/dto/create-product.input';

export const CreateProductValidator = (input: CreateProductInput) => {
  let error = '';
  const { type, minPreorderDays, sku, attendanceType, meetingLink, location } =
    input;
  if (type === ProductType.PRODUCT) {
    if (minPreorderDays === undefined || minPreorderDays === null)
      error = 'Min Preorder Days field is required';
    else if (!sku) error = 'SKU field is required';
  } else {
    if (attendanceType === AttendanceType.ONLINE && !meetingLink)
      error = 'Meeting link is required for online attendance';
    else if (attendanceType === AttendanceType.PHYSICAL && !location)
      error = 'Location is required for physical attendance';
  }

  return error;
};
