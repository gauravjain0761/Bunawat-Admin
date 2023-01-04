import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotificationList = Loadable(lazy(() => import('./notificationList')));
const NotificationDetail = Loadable(lazy(() => import('./notificationDetail')));
const CouponList = Loadable(lazy(() => import('./couponList')));
const CouponDetail = Loadable(lazy(() => import('./couponDetail')));

const MarketingRoutes = [
    { path: '/notifications/list', element: <NotificationList /> },
    { path: '/notifications/add', element: <NotificationDetail /> },
    { path: '/notifications/details/:id', element: <NotificationDetail /> },
    { path: '/coupons/list', element: <CouponList /> },
    { path: '/coupons/add', element: <CouponDetail /> },
    { path: '/coupons/details/:id', element: <CouponDetail /> },
];

export default MarketingRoutes;