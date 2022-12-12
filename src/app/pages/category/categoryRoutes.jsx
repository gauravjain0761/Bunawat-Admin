import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const CategoryList = Loadable(lazy(() => import('./categoryList')));
const CategoryDetail = Loadable(lazy(() => import('./categoryDetail')));

const CategoryRoutes = [
    { path: '/category/list', element: <CategoryList /> },
    { path: '/category/details', element: <CategoryDetail /> },
    { path: '/category/details/:id', element: <CategoryDetail /> },
];

export default CategoryRoutes;
