import { Injectable } from '@nestjs/common';
import { Mailer } from '@nestjs/mail';
import { WelcomeMail } from './mails/welcome.mail.js';

const data = {
  to: {
    name: 'Friend',
    address: 'base@mail.com',
  },
  data: {
    name: 'Hi friend, welcome to NestJS',
  },
};

@Injectable()
export class MailService {
  constructor(private readonly mailer: Mailer) {}

  public async renderMail() {
    const renderMail = await this.mailer.render(WelcomeMail, data);
    return renderMail;
  }

  public async sendTestMail() {
    await this.mailer.send(WelcomeMail, data);
    return true;
  }
}
