import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

@Injectable()
export class BcryptConfigService {
  constructor(private readonly configService: ConfigService) {}

  public hash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(+this.configService.get('envs.HASH_SALT'));
    return bcrypt.hash(password, salt);
  }

  public compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
