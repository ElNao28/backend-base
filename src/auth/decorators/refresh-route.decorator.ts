import { SetMetadata } from '@nestjs/common';

export const IS_REFRESH_ROUTE_KEY = 'isRefreshRouteKey';

export const RefreshRoute = () => SetMetadata(IS_REFRESH_ROUTE_KEY, true);
