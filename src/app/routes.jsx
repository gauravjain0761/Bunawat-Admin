import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';
import categoryRoutes from './pages/category/categoryRoutes';
import inventoryRoutes from './pages/inventory/inventoryRoutes';
import marketingRoutes from './pages/marketing/marketingRoutes';
import orderRoutes from './pages/order/orderRoutes';
import productRoutes from './pages/product/productRoutes';
import userRoute from './pages/users/userRoutes';

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes, ...chartsRoute, ...materialRoutes, ...userRoute, ...categoryRoutes, ...productRoutes, ...inventoryRoutes, ...orderRoutes, ...marketingRoutes],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
