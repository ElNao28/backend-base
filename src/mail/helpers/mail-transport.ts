import { FileMailTransport, MailTransport, SmtpTransport } from '@nestjs/mail';

export type NodeEnviroment = 'dev' | 'production';

export const mailTransport = (
  nodeEnv: NodeEnviroment,
  stmpUrl: string,
): MailTransport => {
  switch (nodeEnv) {
    case 'production':
      return new SmtpTransport({
        url: stmpUrl,
        pool: true,
      });

    case 'dev':
      return new FileMailTransport({
        directory: 'var/mail',
      });
  }
};
