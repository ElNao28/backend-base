import {
  Mailable,
  MailContent,
  MailRenderContext,
  MailTemplateContent,
} from '@nestjs/mail';

interface WelcomeMailData {
  name: string;
  loginUrl: string;
}

export class AccountCreatedMail implements Mailable<WelcomeMailData> {
  render(
    data: WelcomeMailData,
    context: MailRenderContext,
  ):
    | MailContent
    | MailTemplateContent
    | Promise<MailContent | MailTemplateContent> {
    return {
      subject: 'Account created',
      template: 'account-created',
      context: data,
    };
  }
}
