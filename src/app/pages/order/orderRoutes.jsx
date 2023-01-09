import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const OrderList = Loadable(lazy(() => import('./orderList')));
const AddOrder = Loadable(lazy(() => import('./addOrder')));
const OrderDetail = Loadable(lazy(() => import('./orderDetail')));

const OrderRoutes = [
    { path: '/order/list', element: <OrderList /> },
    { path: '/order/add', element: <AddOrder /> },
    { path: '/order/detail', element: <OrderDetail /> },
];

export default OrderRoutes;
