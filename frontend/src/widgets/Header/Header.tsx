import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { meRequest } from "../../features/auth/api/authApi";
import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import styles from "./Header.module.css";

export default function Header() {
    const { user, setUser, token } = useAuthContext();
    const location = useLocation();

    useEffect(() => {
        const loadUser = async () => {
            const response = await meRequest();
            setUser(response.user);
        };
        loadUser();
    }, []);

    useEffect(() => {
        console.log(user?.user_type);
    }, [user]);

    const isActive = (path: string) =>
        location.pathname === path ? styles.navLinkActive : "";

    const getInitials = () => {
        if (!user?.name) return "Me";
        return user.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const authActions = !token ? (
        <>
            <Link to="/login" className={styles.btnOutline}>Log in</Link>
            <Link to="/register" className={styles.btnPrimary}>Register</Link>
        </>
    ) : (
        <Link to="/profile" className={styles.avatar}>{getInitials()}</Link>
    );

    const authorizeUser = () => {
        switch (user?.user_type) {
            case "seller":
                return (
                    <header className={styles.header}>
                        <Link to="/" className={styles.brand}>
                            <span className={styles.brandIcon}>⚡</span>
                            Storefront
                        </Link>

                        <nav className={styles.nav}>
                            <Link to="/" className={`${styles.navLink} ${isActive("/")}`}>Main</Link>
                            <Link to="/items" className={`${styles.navLink} ${isActive("/items")}`}>Catalogue</Link>
                            <Link to="/cart" className={`${styles.navLink} ${isActive("/cart")}`}>Cart</Link>
                            <Link to="/seller/dashboard" className={`${styles.navLink} ${isActive("/seller/dashboard")}`}>
                                Dashboard
                            </Link>
                        </nav>

                        <div className={styles.actions}>{authActions}</div>
                    </header>
                );

            case "admin":
                return (
                    <header className={styles.header}>
                        <Link to="/" className={styles.brand}>
                            <span className={styles.brandIcon}>⚡</span>
                            Storefront
                        </Link>

                        <nav className={styles.nav}>
                            <Link to="/" className={`${styles.navLink} ${isActive("/")}`}>Main</Link>
                            <Link to="/items" className={`${styles.navLink} ${isActive("/items")}`}>Catalogue</Link>
                            <Link to="/cart" className={`${styles.navLink} ${isActive("/cart")}`}>Cart</Link>
                            <Link to="/admin/dashboard" className={`${styles.navLink} ${isActive("/admin/dashboard")}`}>
                                Admin
                                <span className={styles.navBadge}>Admin</span>
                            </Link>
                            <Link to="/admin/users" className={`${styles.navLink} ${isActive("/admin/users")}`}>Users</Link>
                            <Link to="/admin/analytics" className={`${styles.navLink} ${isActive("/admin/analytics")}`}>Analytics</Link>
                        </nav>

                        <div className={styles.actions}>
                            <div className={styles.divider} />
                            {authActions}
                        </div>
                    </header>
                );

            default:
                return (
                    <header className={styles.header}>
                        <Link to="/" className={styles.brand}>
                            <span className={styles.brandIcon}>⚡</span>
                            Storefront
                        </Link>

                        <nav className={styles.nav}>
                            <Link to="/" className={`${styles.navLink} ${isActive("/")}`}>Main</Link>
                            <Link to="/items" className={`${styles.navLink} ${isActive("/items")}`}>Catalogue</Link>
                            <Link to="/cart" className={`${styles.navLink} ${isActive("/cart")}`}>Cart</Link>
                        </nav>

                        <div className={styles.actions}>{authActions}</div>
                    </header>
                );
        }
    };

    return <div className={styles.headerMain}>{authorizeUser()}</div>;
}