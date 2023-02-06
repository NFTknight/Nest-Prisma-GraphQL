import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductQuantityException extends HttpException {
  constructor(itemQuantity: number, quantity: number) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'ProductQuantityException',
        itemQuantity,
        quantity,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class WorkshopQuantityException extends HttpException {
  constructor(itemQuantity: number, quantity: number) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'WorkshopQuantityException',
        itemQuantity,
        quantity,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
