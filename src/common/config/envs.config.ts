import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export default registerAs('envs', () => ({
  PORT: process.env.PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  PACKAGE_MANAGER: process.env.PACKAGE_MANAGER,
  HASH_SALT: process.env.HASH_SALT,
}));

export const EnviromentsValidationSchema = z.object({
  PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  PACKAGE_MANAGER: z.enum(['pnpm', 'npm', 'yarn']),
  HASH_SALT: z.coerce.number().min(8),
});
