import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/LoginPage/LoginPage";
import RegisterPage from "../../pages/RegisterPage/RegisterPage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import ProtectedRoute from "../../shared/ui/ProtectedRoute";
import ProductsPage from "../../pages/ProductsPage/ProductsPage";
import ProductDetailsPage from "../../pages/ProductDetails/ProductDetailsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="/items" element={<ProductsPage />}/>
                <Route path="/item/:id" element={<ProductDetailsPage />}/>
            </Routes>
        </BrowserRouter>
    );
}
