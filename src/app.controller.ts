import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HandlerSuccessResponse } from './common/utils/handler-success-response.js';
import { Public } from './auth/decorators/public.decorator.js';
import { ResponseEmptyApi } from './common/decorators/response-success-api.decorators.js';

@Controller()
export class AppController {
  constructor() {}

  @ResponseEmptyApi()
  @Public()
  @Get('health')
  getHello() {
    return HandlerSuccessResponse.response('Hello world!!', HttpStatus.OK);
  }
}
