import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const CategoryList = Loadable(lazy(() => import('./categoryList')));
const CategoryDetail = Loadable(lazy(() => import('./categoryDetail')));
const CollectionList = Loadable(lazy(() => import('./collectionList')));
const CollectionDetail = Loadable(lazy(() => import('./collectionDetail')));

const CategoryRoutes = [
    { path: '/category/list', element: <CategoryList /> },
    { path: '/category/details', element: <CategoryDetail /> },
    { path: '/category/details/:id', element: <CategoryDetail /> },
    { path: '/collection/list', element: <CollectionList /> },
    { path: '/collection/details', element: <CollectionDetail /> },
    { path: '/collection/details/:id', element: <CollectionDetail /> },
];

export default CategoryRoutes;
