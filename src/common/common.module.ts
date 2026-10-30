import { Module } from '@nestjs/common';
import { BcryptConfigService } from './services/bcrypt.service.js';
import { JwtGeneratorService } from './services/jwt-generator.service.js';

@Module({
  imports: [],
  exports: [BcryptConfigService, JwtGeneratorService],
  providers: [BcryptConfigService, JwtGeneratorService],
})
export class CommonModule {}
