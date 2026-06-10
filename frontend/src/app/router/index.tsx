import { Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage/HomePage";
import LoginPage from "../../pages/LoginPage/LoginPage";
import RegisterPage from "../../pages/RegisterPage/RegisterPage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import ProductsPage from "../../pages/ProductsPage/ProductsPage";
import ProductDetailsPage from "../../pages/ProductDetails/ProductDetailsPage";
import SellerDashboardPage from "../../pages/SellerPage/SellerDashboardPage";
import AdminDashboardPage from "../../pages/AdminDashboardPage/AdminDashboardPage";
import CartPage from "../../pages/CartPage/CartPage";

import ProtectedRoute from "../../shared/ui/ProtectedRoute";
import RoleProtectedRoute from "../../shared/ui/RoleProtectedRoute";

import AccessDeniedPage from "../../pages/AcessDeniedPage/AccessDeniedPage";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/items" element={<ProductsPage />} />
            <Route path="/item/:id" element={<ProductDetailsPage />} />

            <Route path="/cart" element={<CartPage />} />

            <Route
                element={
                    <RoleProtectedRoute user_types={["seller", "admin"]} />
                }
            >
                <Route
                    path="/seller/dashboard"
                    element={<SellerDashboardPage />}
                />
            </Route>

            <Route element={<RoleProtectedRoute user_types={["admin"]} />}>
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboardPage />}
                />
            </Route>

            <Route path="/access_denied" element={<AccessDeniedPage />} />
        </Routes>
    );
}
