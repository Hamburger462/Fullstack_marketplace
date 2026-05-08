import { Link } from "react-router-dom";

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

export default function Header() {
    const { user, token } = useAuthContext();

    switch (user?.user_type) {
        case "seller":
            return (
                <>
                    <div className="Header-main">
                        <Link to="/">Main</Link>

                        <Link to="/items">Catalogue</Link>

                        <Link to="/seller">Seller Dashboard</Link>

                        {!token ? (
                            <>
                                <Link to="/register">Register</Link>
                                <Link to="/login">Login</Link>
                            </>
                        ) : (
                            <Link to="/profile">Profile</Link>
                        )}
                    </div>
                </>
            );
            break;
        case "admin":
            return (
                <div className="Header-main">
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
                </div>
            );
        default:
            return (
                <div className="Header-main">
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
                </div>
            );
            break;
    }
}
