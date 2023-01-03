import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const InventoryList = Loadable(lazy(() => import('./inventoryList')));

const InventoryRoutes = [
    { path: '/inventory/list', element: <InventoryList /> },
];

export default InventoryRoutes;
