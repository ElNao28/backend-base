import { SetMetadata } from '@nestjs/common';

export enum Roles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export const ROLES_KEY = 'roles';

export const Authorization = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
