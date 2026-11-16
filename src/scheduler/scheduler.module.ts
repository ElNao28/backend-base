import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service.js';
import { CleanPreRegistersTask } from './tasks/clean-pre-registers.task.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [],
  imports: [AuthModule],
  providers: [SchedulerService, CleanPreRegistersTask],
})
export class SchedulerModule {}
