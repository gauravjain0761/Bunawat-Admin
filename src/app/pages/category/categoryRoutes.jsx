import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const CategoryList = Loadable(lazy(() => import('./categoryList')));
const CategoryDetail = Loadable(lazy(() => import('./categoryDetail')));
const CollectionList = Loadable(lazy(() => import('./collectionList')));
const CollectionDetail = Loadable(lazy(() => import('./collectionDetail')));
const CategoryAdd = Loadable(lazy(() => import('./categoryAdd')));
const SubCategoryAdd = Loadable(lazy(() => import('./subCategoryAdd')));

const CategoryRoutes = [
    { path: '/category/add', element: <CategoryAdd /> },
    { path: '/category/sub/add', element: <SubCategoryAdd /> },
    { path: '/category/list', element: <CategoryList /> },
    { path: '/category/details', element: <CategoryDetail /> },
    { path: '/category/details/:id', element: <CategoryDetail /> },
    { path: '/collection/list', element: <CollectionList /> },
    { path: '/collection/details', element: <CollectionDetail /> },
    { path: '/collection/details/:id', element: <CollectionDetail /> },
];

export default CategoryRoutes;
