import { Controller, Get, Header, Post } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { ResponseEmptyApi } from '../common/decorators/response-success-api.decorators.js';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Get('welcome')
  @Header('content-type', 'text/html;  charset=utf-8')
  public async renderMail() {
    const mail = await this.mailService.renderMail();
    const body = mail.html;
    return body;
  }

  @Public()
  @ResponseEmptyApi()
  @Post('send-test')
  public sendTestMail() {
    return this.mailService.sendTestMail();
  }
}
