import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';

// Envitoment configuration
import generalConfig, {
  EnviromentsValidationSchema,
} from './shared/config/envs.config.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [generalConfig],
      validationSchema: EnviromentsValidationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
