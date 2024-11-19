import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./user/pages/Login";
import Signup from "./user/pages/Signup";
import LandingPage from "./user/pages/LandingPage";
import OTPverify from "./user/pages/OTPverify";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminAddProduct from "./admin/pages/AdminAddProduct";
import PublicRoute from "./user/components/PublicRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminProtetedRoutes from "./admin/components/AdminProtetedRoutes";
import AdminPublicRoutes from "./admin/components/AdminPublicRoutes";
import AdminAddCatagories from "./admin/pages/AdminAddCatagories";
import AdminCatagories from "./admin/pages/AdminCatagories";
import AdminOffers from "./admin/pages/AdminOffers";
import AdminCoupons from "./admin/pages/AdminCoupons";
import AdminOrderList from "./admin/pages/AdminOrderList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetail from "./user/pages/ProductDetail";
import ProtectedRoutes from "./user/components/ProtectedRoutes";
import AdminEditProduct from "./admin/pages/AdminEditProduct";
import AllProducts from "./user/pages/AllProducts";
import CartPage from "./user/pages/CartPage";
import UserProfile from "./user/pages/UserProfile";
import ResetPassword from "./user/pages/ResetPassword";
import Address from "./user/pages/Address";
import AddAddress from "./user/pages/AddAddress";
import EditAddress from "./user/pages/EditAddress";
import PaymentPage from "./user/pages/PaymentPage";
import OrderSuccess from "./user/pages/OrderSuccess";
import UserOrders from "./user/pages/UserOrders";
import UserOrderDetails from "./user/pages/UserOrderDetails";
import WishList from "./user/pages/WishList";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route path="/verifyOtp/:userId" element={<OTPverify />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />{" "}
          <Route
            path="/all"
            element={
              <ProtectedRoutes>
                <AllProducts />
              </ProtectedRoutes>
            }
          />
          {/* product detail */}
          <Route
            path="/productDetail/:productId"
            element={
              <ProtectedRoutes>
                <ProductDetail />
              </ProtectedRoutes>
            }
          />
          {/* cart page */}
          <Route
            path="/cart"
            element={
              <ProtectedRoutes>
                <CartPage />
              </ProtectedRoutes>
            }
          />
          {/* user wishlist page */}
          <Route
            path="/wishList"
            element={
              <ProtectedRoutes>
                <WishList />
              </ProtectedRoutes>
            }
          />
          {/* payment page */}
          <Route
            path="/payment"
            element={
              <ProtectedRoutes>
                <PaymentPage />
              </ProtectedRoutes>
            }
          />
          {/* payment page */}
          <Route
            path="/success"
            element={
              <ProtectedRoutes>
                <OrderSuccess />
              </ProtectedRoutes>
            }
          />
          {/* user profile page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoutes>
                <UserProfile />
              </ProtectedRoutes>
            }
          />
          {/* user Reset page */}
          <Route
            path="/profile/resetPassword/:userId"
            element={
              <ProtectedRoutes>
                <ResetPassword />
              </ProtectedRoutes>
            }
          />
          {/* user manage address page */}
          <Route
            path="/profile/address"
            element={
              <ProtectedRoutes>
                <Address />
              </ProtectedRoutes>
            }
          />
          {/* user add address page */}
          <Route
            path="/profile/addAddress"
            element={
              <ProtectedRoutes>
                <AddAddress />
              </ProtectedRoutes>
            }
          />
          {/* user edit address page */}
          <Route
            path="/profile/editAddress/:addressId"
            element={
              <ProtectedRoutes>
                <EditAddress />
              </ProtectedRoutes>
            }
          />
          {/* user orders page */}
          <Route
            path="/profile/orders"
            element={
              <ProtectedRoutes>
                <UserOrders />
              </ProtectedRoutes>
            }
          />
          {/* user order detail page */}
          <Route
            path="/profile/orderDetail/:orderId"
            element={
              <ProtectedRoutes>
                <UserOrderDetails />
              </ProtectedRoutes>
            }
          />
          {/* admin login */}
          <Route
            path="/admin/login"
            element={
              <AdminPublicRoutes>
                <AdminLogin />
              </AdminPublicRoutes>
            }
          />
          {/* admin dashboard */}
          <Route
            path="/admin"
            element={
              <AdminProtetedRoutes>
                <AdminDashboard />
              </AdminProtetedRoutes>
            }
          />
          {/* admin products */}
          <Route
            path="/admin/products"
            element={
              <AdminProtetedRoutes>
                <AdminProducts />
              </AdminProtetedRoutes>
            }
          />
          {/* admin add products */}
          <Route
            path="/admin/addProducts"
            element={
              <AdminProtetedRoutes>
                <AdminAddProduct />
              </AdminProtetedRoutes>
            }
          />
          {/* admin edit product */}
          <Route
            path="/admin/editProduct/:productId"
            element={
              <AdminProtetedRoutes>
                <AdminEditProduct />
              </AdminProtetedRoutes>
            }
          />
          {/* admin users */}
          <Route
            path="/admin/users"
            element={
              <AdminProtetedRoutes>
                <AdminUsers />
              </AdminProtetedRoutes>
            }
          />
          {/* admin add categories */}
          <Route
            path="/admin/addCatagories"
            element={
              <AdminProtetedRoutes>
                <AdminAddCatagories />
              </AdminProtetedRoutes>
            }
          />
          {/* admin categories */}
          <Route
            path="/admin/catagories"
            element={
              <AdminProtetedRoutes>
                <AdminCatagories />
              </AdminProtetedRoutes>
            }
          />
          {/* admin offers */}
          <Route
            path="/admin/offers"
            element={
              <AdminProtetedRoutes>
                <AdminOffers />
              </AdminProtetedRoutes>
            }
          />
          {/* admin cupons */}
          <Route
            path="/admin/cupons"
            element={
              <AdminProtetedRoutes>
                <AdminCoupons />
              </AdminProtetedRoutes>
            }
          />
          {/* admin dashboard */}
          <Route
            path="/admin/orders"
            element={
              <AdminProtetedRoutes>
                <AdminOrderList />
              </AdminProtetedRoutes>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
