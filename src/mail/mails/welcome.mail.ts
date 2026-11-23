import {
  Mailable,
  MailContent,
  MailRenderContext,
  MailTemplateContent,
} from '@nestjs/mail';

export interface NameData {
  name: string;
}

export class WelcomeMail implements Mailable<NameData> {
  render(
    data: NameData,
    context: MailRenderContext,
  ):
    | MailContent
    | MailTemplateContent
    | Promise<MailContent | MailTemplateContent> {
    return {
      subject: 'Hello world',
      template: 'welcome-template',
      context: {
        name: data.name,
      },
    };
  }
}
