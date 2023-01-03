import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const OrderList = Loadable(lazy(() => import('./orderList')));

const OrderRoutes = [
    { path: '/order/list', element: <OrderList /> },
];

export default OrderRoutes;
