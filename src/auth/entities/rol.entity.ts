import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { User } from './user.entity.js';

@Entity('rol')
export class Rol extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
