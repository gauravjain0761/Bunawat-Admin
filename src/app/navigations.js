export const navigations = [
  { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  {
    name: 'User Management',
    icon: 'dashboard',
    children: [
      { name: 'Customers', iconText: 'SI', path: '/customer' },
      { name: 'Resellers', iconText: 'SI', path: '/reseller' },
      { name: 'Influncers', iconText: 'SI', path: '/influncer' },
      // { name: 'Add User', iconText: 'SI', path: '/user/add' },
    ],
  },
  {
    name: 'Category Management',
    icon: 'dashboard',
    children: [
      { name: 'Parent Category', iconText: 'SI', path: '/category/parent' },
      { name: 'Parent Sub Category', iconText: 'SI', path: '/category/sub' },
      { name: 'Category', iconText: 'SI', path: '/category/list' },
      // { name: 'Add Category', iconText: 'SI', path: '/category/details' },
      { name: 'Collection List', iconText: 'SI', path: '/collection/list' },
      // { name: 'Add Collection', iconText: 'SI', path: '/collection/details' },
    ],
  },
  {
    name: 'Product Management',
    icon: 'dashboard',
    children: [
      { name: 'Attributes', iconText: 'SI', path: '/product/attributes' },
      { name: 'Product', iconText: 'SI', path: '/product/list' },
      { name: 'Media', iconText: 'SI', path: '/product/media' },
    ],
  },
  {
    name: 'Inventory Management',
    icon: 'dashboard',
    children: [
      { name: 'Inventory', iconText: 'SI', path: '/inventory/list' },
    ],
  },
  {
    name: 'Order Management',
    icon: 'dashboard',
    children: [
      { name: 'Order', iconText: 'SI', path: '/order/list' },
    ],
  },
  {
    name: 'Marketing Management',
    icon: 'dashboard',
    children: [
      { name: 'Notifications', iconText: 'SI', path: '/notifications/list' },
      { name: 'Coupons', iconText: 'SI', path: '/coupons/list' },
    ],
  },

  // { name: 'User List', iconText: 'SI', path: '/user/list' },
  // { name: 'User details', iconText: 'SU', path: '/user/details' },
  // { name: 'User payment', iconText: 'FP', path: '/user/payment' },
  // { name: 'User payment history', iconText: '404', path: '/user/payment/history' },
  // { name: 'User Cart Details', iconText: '404', path: '/user/cart/details' },
  // { name: 'User wishlist', iconText: '404', path: '/user/wishlist' },
  // { name: 'Guest Login', iconText: '404', path: '/guest/list' },
  // { label: 'PAGES', type: 'label' },
  // {
  //   name: 'Session/Auth',
  //   icon: 'security',
  //   children: [
  //     { name: 'Sign in', iconText: 'SI', path: '/session/signin' },
  //     { name: 'Sign up', iconText: 'SU', path: '/session/signup' },
  //     { name: 'Forgot Password', iconText: 'FP', path: '/session/forgot-password' },
  //     { name: 'Error', iconText: '404', path: '/session/404' },
  //   ],
  // },
  // { label: 'Components', type: 'label' },
  // {
  //   name: 'Components',
  //   icon: 'favorite',
  //   badge: { value: '30+', color: 'secondary' },
  //   children: [
  //     { name: 'Auto Complete', path: '/material/autocomplete', iconText: 'A' },
  //     { name: 'Buttons', path: '/material/buttons', iconText: 'B' },
  //     { name: 'Checkbox', path: '/material/checkbox', iconText: 'C' },
  //     { name: 'Dialog', path: '/material/dialog', iconText: 'D' },
  //     { name: 'Expansion Panel', path: '/material/expansion-panel', iconText: 'E' },
  //     { name: 'Form', path: '/material/form', iconText: 'F' },
  //     { name: 'Icons', path: '/material/icons', iconText: 'I' },
  //     { name: 'Menu', path: '/material/menu', iconText: 'M' },
  //     { name: 'Progress', path: '/material/progress', iconText: 'P' },
  //     { name: 'Radio', path: '/material/radio', iconText: 'R' },
  //     { name: 'Switch', path: '/material/switch', iconText: 'S' },
  //     { name: 'Slider', path: '/material/slider', iconText: 'S' },
  //     { name: 'Snackbar', path: '/material/snackbar', iconText: 'S' },
  //     { name: 'Table', path: '/material/table', iconText: 'T' },
  //   ],
  // },
  // {
  //   name: 'Charts',
  //   icon: 'trending_up',
  //   children: [{ name: 'Echarts', path: '/charts/echarts', iconText: 'E' }],
  // },
  // {
  //   name: 'Documentation',
  //   icon: 'launch',
  //   type: 'extLink',
  //   path: 'http://demos.ui-lib.com/matx-react-doc/',
  // },
];
