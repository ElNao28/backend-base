import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { User } from './user.entity.js';

@Entity({ name: 'credentials' })
export class Credentials extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    name: 'password_changed_at',
    type: 'timestamptz',
    nullable: true,
  })
  passwordChangedAt?: Date | null;

  @OneToOne(() => User, (user) => user.credentials, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user: Relation<User>;
}
