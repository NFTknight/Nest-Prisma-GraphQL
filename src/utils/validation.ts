import { NotFoundException } from '@nestjs/common';
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

export const throwNotFoundException = (
  data: any,
  label: string,
  message?: string
) => {
  if (!data)
    throw new NotFoundException(
      message ? message : `${label} not found for this id`
    );
};
