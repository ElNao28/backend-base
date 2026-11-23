import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { MailController } from './mail.controller.js';
import { FileTemplateEngine, MailModule } from '@nestjs/mail';
import { ConfigService } from '@nestjs/config';
import { WelcomeMail } from './mails/welcome.mail.js';
import { join } from 'path';
import { cwd } from 'process';
import { mailTransport, NodeEnviroment } from './helpers/mail-transport.js';

@Module({
  imports: [
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const smtpUrl: string = configService.get('envs.SMTP_URL')!;
        const enviroment: NodeEnviroment = configService.get('envs.NODE_ENV')!;
        return {
          transport: mailTransport(enviroment, smtpUrl),
          templates: new FileTemplateEngine({
            dir: join(cwd(), 'src', 'mail', 'templates'),
            layout: 'layout',
          }),
          from: `Nest <${configService.get('envs.ADDRESS_MAIL')}>`,
        };
      },
    }),
  ],
  controllers: process.env.NODE_ENV === 'production' ? [] : [MailController],
  providers: [MailService, WelcomeMail],
})
export class MailerModule {}
