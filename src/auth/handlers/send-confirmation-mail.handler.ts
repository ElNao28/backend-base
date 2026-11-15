import { Injectable } from '@nestjs/common';
import { OnOutboxMessage } from '@nestjs/outbox';
import { ConfirmationMailDto } from '../dto/requests/mail-confirmation.dto.js';
import { Mailer } from '@nestjs/mail';
import { SendConfirmationRegisterMail } from '../../mail/mails/send-confirmation-register.mail.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendConfirmationMailHandler {
  constructor(
    private readonly mailer: Mailer,
    private readonly configService: ConfigService,
  ) {}

  @OnOutboxMessage('send.verification.mail', { consumer: 'confirmation-mail' })
  public async sendConfirmationMail(data: ConfirmationMailDto) {
    const { email, verificationToken } = data;
    const verificationUrl = `${this.configService.get('envs.FRONTEND_URL')}/example-verification-url?token=${encodeURI(verificationToken)}`;
    await this.mailer.send(SendConfirmationRegisterMail, {
      to: { name: email, address: email },
      data: {
        email,
        verificationUrl,
      },
    });
  }
}
