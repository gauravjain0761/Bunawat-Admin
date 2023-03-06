import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import Customer from './role/customer';
import Influncer from './role/influncer';
import Reseller from './role/reseller';

const UserList = Loadable(lazy(() => import('./userList')));
const UserDetail = Loadable(lazy(() => import('./userDetail')));
const UserPayment = Loadable(lazy(() => import('./userPayment')));
const UserPaymentHistory = Loadable(lazy(() => import('./userPaymentHistory')));
const UserCartDetail = Loadable(lazy(() => import('./userCartDetail')));
const UserWishlist = Loadable(lazy(() => import('./userWishlist')));
const GuestList = Loadable(lazy(() => import('./guestList')));
const AddUser = Loadable(lazy(() => import('./addUser')));

const userRoute = [
    { path: '/customer', element: <Customer /> },
    { path: '/reseller', element: <Reseller /> },
    { path: '/influncer', element: <Influncer /> },
    { path: '/user/add', element: <AddUser /> },
    { path: '/user/add/:type', element: <AddUser /> },
    // { path: '/user/list', element: <UserList /> },
    { path: '/user/details', element: <UserDetail /> },
    { path: '/user/details/:type/:id', element: <UserDetail /> },
    { path: '/user/details/view/:type/:id', element: <UserDetail disable={true} /> },
    { path: '/user/payment', element: <UserPayment /> },
    { path: '/user/payment/history', element: <UserPaymentHistory /> },
    { path: '/user/cart/details', element: <UserCartDetail /> },
    { path: '/user/wishlist', element: <UserWishlist /> },
    { path: '/guest/list', element: <GuestList /> },
];

export default userRoute;
