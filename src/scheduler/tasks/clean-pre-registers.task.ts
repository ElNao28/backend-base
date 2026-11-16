import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SchedulerService } from '../scheduler.service.js';

@Injectable()
export class CleanPreRegistersTask {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Cron('0 0 0 * * *', {
    timeZone: 'America/Mexico_City',
  })
  public async cleanPreRegisters() {
    await this.schedulerService.cleanPreRegisters();
  }
}
