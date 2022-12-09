import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import SidebarComponent from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Userlist from "./pages/user/userList";
import UserDetail from "./pages/user/userDetail";
import UserPaymentHistory from "./pages/user/userPaymentHistory";
import UserCartDetail from "./pages/user/userCartDetail";
import UserWishlist from "./pages/user/userWishlist";
import GuestList from "./pages/user/guestList";
import UserPayment from "./pages/user/userPayment";
import CategoryTreeList from "./pages/category/categoryTreeList";
import SubCategoryManagement from "./pages/category/subCategoryManagement";
import CategoryManagement from "./pages/category/categoryManagement";
import ProductsVariations from "./pages/product/productsVariations";
import CategoryWiseList from "./pages/product/categoryWiseList";
import AddProduct from "./pages/product/addProduct";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <SidebarComponent isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user-list" element={<Userlist />} />
              <Route path="/user-details" element={<UserDetail />} />
              <Route path="/user-payment" element={<UserPayment />} />
              <Route path="/user-payment-history" element={<UserPaymentHistory />} />
              <Route path="/user-cart-details" element={<UserCartDetail />} />
              <Route path="/user-wishlist" element={<UserWishlist />} />
              <Route path="/guest-list" element={<GuestList />} />

              <Route path="/category-management" element={<CategoryManagement />} />
              <Route path="/sub-category-management" element={<SubCategoryManagement />} />
              <Route path="/category-tree-list" element={<CategoryTreeList />} />

              <Route path="/category-wise-list" element={<CategoryWiseList />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/products-variations" element={<ProductsVariations />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
