import { HttpStatus } from '@nestjs/common';

export class PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  totalPage: number;
}

export class HandlerSuccessResponse<T> {
  constructor(
    public message: string,
    public statusCode: HttpStatus,
    public data: T,
    public pagination?: PaginationData,
  ) {}

  public static response<T>(
    message: string = 'Operation completed successfully',
    statusCode: HttpStatus = HttpStatus.OK,
    data: T = true as T,
    pagination?: PaginationData,
  ): HandlerSuccessResponse<T> {
    return new HandlerSuccessResponse(message, statusCode, data, pagination);
  }
}
