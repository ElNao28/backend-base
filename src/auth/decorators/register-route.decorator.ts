import { SetMetadata } from '@nestjs/common';

export const IS_REGISTER_ROUTE_KEY = 'register_route';

export const RegisterRoute = () => SetMetadata(IS_REGISTER_ROUTE_KEY, true);
