import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pre_register')
export class PreRegister {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'token_hash',
  })
  tokenHash: string;

  @Column({
    unique: true,
  })
  jti: string;

  @Column({
    type: 'int',
    default: 0,
  })
  attempts: number;

  @Column({
    type: 'timestamptz',
    name: 'expires_at',
  })
  expiresAt: Date;
}
