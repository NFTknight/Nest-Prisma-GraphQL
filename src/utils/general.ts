import { BadRequestException } from '@nestjs/common';

export const checkIfTimeInRange = (
  from: Date,
  to: Date,
  fromTime: string,
  toTime: string
) => {
  const fromDate = setHoursMinsToDate(from, fromTime);
  const toDate = setHoursMinsToDate(to, toTime);

  let isInRange = false;
  if (
    (from.getTime() > fromDate.getTime() ||
      from.getTime() === fromDate.getTime()) &&
    (to.getTime() < toDate.getTime() || to.getTime() === toDate.getTime())
  ) {
    isInRange = true;
  }
  return isInRange;
};

const setHoursMinsToDate = (_date: Date, time: string) => {
  const date = new Date(_date || null);
  const splittedTime = time?.split(':') || ['0', '0'];
  date.setUTCHours(Number(splittedTime[0]), Number(splittedTime[1]));
  return date;
};

export const getReadableDate = (dateString: string) => {
  const date = new Date(dateString);
  if (!date) throw new BadRequestException('Valid date is required');

  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

export const checkIfQuantityIsGood = (
  requiredQuantity: number,
  availableQuantity?: number | null
) => {
  if (
    typeof availableQuantity === 'number' &&
    availableQuantity < requiredQuantity
  ) {
    return false;
  }
  return true;
};
