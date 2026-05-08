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
            for (const user_type in user_types) {
                if (response.user.user_type == user_type) {
                    return true;
                } else {
                    navigate("/access_denied");
                    return false;
                }
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
