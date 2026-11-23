import {
  Mailable,
  MailContent,
  MailRenderContext,
  MailTemplateContent,
} from '@nestjs/mail';

interface ConfirmationMail {
  email: string;
  verificationUrl: string;
}

export class SendConfirmationRegisterMail implements Mailable<ConfirmationMail> {
  render(
    data: ConfirmationMail,
    context: MailRenderContext,
  ):
    | MailContent
    | MailTemplateContent
    | Promise<MailContent | MailTemplateContent> {
    return {
      template: 'send-confirmation-mail',
      subject: 'Register verification',
      context: data,
    };
  }
}
