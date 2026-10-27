import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export default registerAs('envs', () => ({
  PORT: process.env.PORT || 'localhost',
  HOST: process.env.HOST || 3000,
}));

export const EnviromentsValidationSchema = z.object({
  PORT: z.coerce.number(),
  HOST: z.string().default('localhost'),
});
