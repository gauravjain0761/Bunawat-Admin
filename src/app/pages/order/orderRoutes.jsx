import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const OrderList = Loadable(lazy(() => import('./orderList')));
const AddOrder = Loadable(lazy(() => import('./addOrder')));
const OrderDetail = Loadable(lazy(() => import('./orderDetail')));
const OrderEdit = Loadable(lazy(() => import('./orderEdit')));

const OrderRoutes = [
    { path: '/order/list', element: <OrderList /> },
    { path: '/order/add', element: <AddOrder /> },
    { path: '/order/detail/:id', element: <OrderDetail /> },
    { path: '/order/edit/:id', element: <OrderEdit /> },
];

export default OrderRoutes;
