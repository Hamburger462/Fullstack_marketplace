import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { tokenStorage } from "../../shared/lib/tokenStorage";

export default function Header() {
    const [auth, setAuth] = useState<string>(tokenStorage.get() || "");
    useEffect(() => {
        const token = tokenStorage.get();
        if (!token) return;

        setAuth(token);
    }, []);

    return (
        <div className="Header-main">
            <Link to="/">Main</Link>

            {!auth ? (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </>
            ) : (
                <Link to="/profile">Profile</Link>
            )}

            <Link to="/items">Catalogue</Link>
        </div>
    );
}