import { Module } from '@nestjs/common';
import { BcryptConfigService } from './services/bcrypt.service.js';

@Module({
  imports: [],
  exports: [BcryptConfigService],
  providers: [BcryptConfigService],
})
export class CommonModule {}
