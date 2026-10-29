import { HttpStatus } from '@nestjs/common';

export class HandlerSuccessResponse<T> {
  constructor(
    public message: string,
    public statusCode: HttpStatus,
    public data?: T,
  ) {}

  public static response<T>(
    message: string = 'Operation completed successfully',
    statusCode: HttpStatus = HttpStatus.OK,
    data?: T,
  ): HandlerSuccessResponse<T> {
    return new HandlerSuccessResponse(message, statusCode, data);
  }
}
