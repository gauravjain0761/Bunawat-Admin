import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import Demo from './demo';

const AttributeList = Loadable(lazy(() => import('./attribute/attributeList')));
const AddProduct = Loadable(lazy(() => import('./addProduct/addProduct')));
const ProductMedia = Loadable(lazy(() => import('./media/index')));
const ProductMediaSingleList = Loadable(lazy(() => import('./media/singleList')));
const ProductList = Loadable(lazy(() => import('./productList')));
const ColorList = Loadable(lazy(() => import('./color/colorList')));
const SizeList = Loadable(lazy(() => import('./size/sizeList')));
const TagList = Loadable(lazy(() => import('./tag/tagList')));
const ColorDetail = Loadable(lazy(() => import('./color/colorDetails')));
const SizeDetail = Loadable(lazy(() => import('./size/sizeDetails')));
const TagDetail = Loadable(lazy(() => import('./tag/tagDetails')));

const ProductRoutes = [
    { path: '/product/demo', element: <Demo /> },
    { path: '/product/attributes', element: <AttributeList /> },
    { path: '/product/list', element: <ProductList /> },
    { path: '/product/add', element: <AddProduct /> },
    { path: '/product/media', element: <ProductMedia /> },
    { path: '/product/media/:designNo', element: <ProductMediaSingleList /> },
    { path: '/product/add/:id', element: <AddProduct /> },
    { path: '/product/color', element: <ColorList /> },
    { path: '/product/color/detail', element: <ColorDetail /> },
    { path: '/product/color/detail/:id', element: <ColorDetail /> },
    { path: '/product/size', element: <SizeList /> },
    { path: '/product/size/detail', element: <SizeDetail /> },
    { path: '/product/size/detail/:id', element: <SizeDetail /> },
    { path: '/product/tag', element: <TagList /> },
    { path: '/product/tag/detail', element: <TagDetail /> },
    { path: '/product/tag/detail/:id', element: <TagDetail /> },
];

export default ProductRoutes;
