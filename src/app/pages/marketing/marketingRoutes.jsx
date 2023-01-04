import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotificationList = Loadable(lazy(() => import('./notificationList')));
const CouponList = Loadable(lazy(() => import('./couponList')));

const MarketingRoutes = [
    { path: '/notifications/list', element: <NotificationList /> },
    { path: '/coupons/list', element: <CouponList /> },
];

export default MarketingRoutes;