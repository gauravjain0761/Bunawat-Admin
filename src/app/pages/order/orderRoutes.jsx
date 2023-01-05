import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const OrderList = Loadable(lazy(() => import('./orderList')));
const OrderDetail = Loadable(lazy(() => import('./orderDetail')));

const OrderRoutes = [
    { path: '/order/list', element: <OrderList /> },
    { path: '/order/add', element: <OrderDetail /> },
];

export default OrderRoutes;
