import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const CategoryList = Loadable(lazy(() => import('./categoryList')));
const CategoryDetail = Loadable(lazy(() => import('./categoryDetail')));
const CollectionList = Loadable(lazy(() => import('./collectionList')));
const CollectionDetail = Loadable(lazy(() => import('./collectionDetail')));
const ParentCategory = Loadable(lazy(() => import('./parentCategory')));
const SubCategory = Loadable(lazy(() => import('./subCategory')));

const CategoryRoutes = [
    { path: '/category/parent', element: <ParentCategory /> },
    { path: '/category/sub', element: <SubCategory /> },
    { path: '/category/list', element: <CategoryList /> },
    { path: '/category/details', element: <CategoryDetail /> },
    { path: '/category/details/:type', element: <CategoryDetail /> },
    { path: '/category/details/:type/:id', element: <CategoryDetail /> },
    { path: '/collection/list', element: <CollectionList /> },
    { path: '/collection/details/:type', element: <CollectionDetail /> },
    { path: '/collection/details/:type/:id', element: <CollectionDetail /> },
];

export default CategoryRoutes;
