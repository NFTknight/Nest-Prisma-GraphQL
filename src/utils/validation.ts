import { AttendanceType } from '@prisma/client';
import { CreateProductInput } from 'src/products/dto/create-product.input';

export const CreateProductValidator = (input: CreateProductInput) => {
  let error = null;
  const { attendanceType, meetingLink, location } = input;

  if (attendanceType === AttendanceType.ONLINE && !meetingLink)
    error = 'Meeting link is required for online attendance';
  else if (attendanceType === AttendanceType.PHYSICAL && !location)
    error = 'Location is required for physical attendance';

  return error;
};
