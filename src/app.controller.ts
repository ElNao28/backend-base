import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { HandlerSuccessResponse } from './common/utils/handler-success-response.js';
import { SuccessResponseDto } from './common/dto/success-response.dto.js';

@Controller()
export class AppController {
  constructor() {}

  @ApiOkResponse({
    type: SuccessResponseDto,
  })
  @Get('health')
  getHello() {
    return HandlerSuccessResponse.response('Hello world!!', HttpStatus.OK);
  }
}
