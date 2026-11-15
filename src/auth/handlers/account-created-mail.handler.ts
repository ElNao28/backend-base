import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mailer } from '@nestjs/mail';
import { OnOutboxMessage } from '@nestjs/outbox';
import { AccountCreatedMail } from '../../mail/mails/account-created.mail.js';
import { CreatedAccountDto } from '../dto/requests/account-created.dto.js';

@Injectable()
export class AccountCreatedHandler {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailer: Mailer,
  ) {}

  @OnOutboxMessage('welcome.mail', { consumer: 'account-created-mail' })
  public async sendWelcomeMail(data: CreatedAccountDto) {
    const loginUrl = this.configService.get('envs.FRONTEND_URL');
    const { name, email } = data;

    await this.mailer.send(AccountCreatedMail, {
      to: {
        name,
        address: email,
      },
      data: {
        loginUrl,
        name,
      },
    });
  }
}
