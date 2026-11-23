import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PreRegister } from '../auth/entities/pre-register.entity.js';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
  private logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(PreRegister)
    private readonly preRegisterRepository: Repository<PreRegister>,
  ) {}

  public async cleanPreRegisters() {
    const { affected } = await this.preRegisterRepository.delete({
      expiresAt: Raw((alias) => `${alias} < NOW()`),
    });

    this.logger.log(
      `Clean Pre-register table. Deleted records: ${affected ?? 0}`,
    );
  }
}
