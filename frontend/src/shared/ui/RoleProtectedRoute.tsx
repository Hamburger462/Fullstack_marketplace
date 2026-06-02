import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import { meRequest } from "../../features/auth/api/authApi";

type RoleProtectedRouteProps = {
    user_types: Array<string>;
};

export default function RoleProtectedRoute({
    user_types,
}: RoleProtectedRouteProps) {
    const navigate = useNavigate();

    const checkUser = async () => {
        try {
            const response = await meRequest();
            if(!user_types.includes(response.user.user_type)){
                throw new Error("Access denied")
            }
            else{
                return;
            }
        } catch (err) {
            console.error(err);
            navigate("/access_denied");
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    return <Outlet />;
}
