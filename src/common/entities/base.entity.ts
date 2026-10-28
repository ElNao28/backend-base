import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export class BaseEntity {
  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date;
}
