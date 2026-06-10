import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginRequest } from "../../features/auth/api/authApi";
import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import styles from "../AuthPages.module.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setUser, setToken } = useAuthContext();

    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const data = await loginRequest({ email: form.email, password: form.password });
            setUser(data.user);
            setToken(data.token);
            navigate("/profile");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>

                {/* Brand */}
                <Link to="/" className={styles.brand}>
                    <span className={styles.brandIcon}>⚡</span>
                    Storefront
                </Link>

                <h1 className={styles.heading}>Welcome back</h1>
                <p className={styles.subheading}>Sign in to your account to continue</p>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>

                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={styles.input}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={styles.input}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <i className="ti ti-alert-circle" style={{ fontSize: 14 }} aria-hidden="true" />
                            {error}
                        </div>
                    )}

                    <button type="submit" className={styles.btnSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <i className="ti ti-loader-2" style={{ fontSize: 15 }} aria-hidden="true" />
                                Signing in…
                            </>
                        ) : (
                            <>
                                <i className="ti ti-login" style={{ fontSize: 15 }} aria-hidden="true" />
                                Sign in
                            </>
                        )}
                    </button>

                </form>

                <p className={styles.footer}>
                    No account?{" "}
                    <Link to="/register" className={styles.footerLink}>
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
}