import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';
import DemoPDF from './Demo';

const Analytics = Loadable(lazy(() => import('./Analytics')));

const dashboardRoutes = [
  { path: '/dashboard', element: <Analytics />, auth: authRoles.admin },
  // { path: '/dashboard/demo', element: <DemoPDF />, auth: authRoles.admin },
];

export default dashboardRoutes;
