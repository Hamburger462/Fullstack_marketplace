import { Link } from "react-router-dom";
import { useEffect } from "react";

import { meRequest } from "../../features/auth/api/authApi";

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import "./Header.css";

export default function Header() {
    const { user, setUser ,token } = useAuthContext();

    useEffect(() => {
        const loadUser = async () => {
            const response = await meRequest();
            setUser(response.user);
        }

        loadUser();
    }, [])

    useEffect(() => {
        console.log(user?.user_type)
    }, [user])

    const authorizeUser = () => {
        switch (user?.user_type) {
            case "seller":
                return (
                    <header>
                        <Link to="/">Main</Link>

                        <Link to="/items">Catalogue</Link>

                        <Link to="/seller/dashboard">Seller Dashboard</Link>

                        {!token ? (
                            <>
                                <Link to="/register">Register</Link>
                                <Link to="/login">Login</Link>
                            </>
                        ) : (
                            <Link to="/profile">Profile</Link>
                        )}
                    </header>
                );
                break;
            case "admin":
                return (
                    <header>
                        <Link to="/">Main</Link>

                        <Link to="/items">Catalogue</Link>

                        <Link to="">Admin Dashboard</Link>

                        <Link to="">Users</Link>

                        <Link to="">Analytics</Link>

                        {!token ? (
                            <>
                                <Link to="/register">Register</Link>
                                <Link to="/login">Login</Link>
                            </>
                        ) : (
                            <Link to="/profile">Profile</Link>
                        )}
                    </header>
                );
                break;
            default:
                return (
                    <header>
                        <Link to="/">Main</Link>

                        <Link to="/items">Catalogue</Link>

                        {!token ? (
                            <>
                                <Link to="/register">Register</Link>
                                <Link to="/login">Login</Link>
                            </>
                        ) : (
                            <Link to="/profile">Profile</Link>
                        )}
                    </header>
                );
                break;
        }
    };

    return <div className="Header-main">{authorizeUser()}</div>;
}
