import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { Rol } from './rol.entity.js';
import { RefreshToken } from './refresh-token.entity.js';
import { Credentials } from './credentials.entity.js';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 64,
  })
  lastname: string;

  @Column({
    name: 'second_lastname',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  secondLastName?: string;

  @Column({
    type: 'date',
  })
  birthdate: string;

  @Column({
    type: 'varchar',
    length: 10,
    unique: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
  })
  email: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @ManyToMany(() => Rol, (rol) => rol.users)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'rol_id',
    },
  })
  roles: Rol[];

  @OneToMany(() => RefreshToken, (refresh) => refresh.user)
  refreshTokens: RefreshToken[];

  @OneToOne(() => Credentials, (credentials) => credentials.user)
  credentials: Relation<Credentials>;
}
