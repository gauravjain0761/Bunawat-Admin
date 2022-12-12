import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const UserList = Loadable(lazy(() => import('./userList')));
const UserDetail = Loadable(lazy(() => import('./userDetail')));
const UserPayment = Loadable(lazy(() => import('./userPayment')));
const UserPaymentHistory = Loadable(lazy(() => import('./userPaymentHistory')));
const UserCartDetail = Loadable(lazy(() => import('./userCartDetail')));
const UserWishlist = Loadable(lazy(() => import('./userWishlist')));
const GuestList = Loadable(lazy(() => import('./guestList')));

const userRoute = [
    { path: '/user/list', element: <UserList />},
    { path: '/user/details', element: <UserDetail />},
    { path: '/user/payment', element: <UserPayment />},
    { path: '/user/payment/history', element: <UserPaymentHistory />},
    { path: '/user/cart/details', element: <UserCartDetail />},
    { path: '/user/wishlist', element: <UserWishlist />},
    { path: '/guest/list', element: <GuestList />},
];

export default userRoute;
