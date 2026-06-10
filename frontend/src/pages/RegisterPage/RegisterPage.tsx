import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerRequest } from "../../features/auth/api/authApi";
import { tokenStorage } from "../../shared/lib/tokenStorage";

import styles from "../AuthPages.module.css";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        username: "",
        firstName: "",
        lastName: "",
        avatar: "",
        phone: "",
        userType: "buyer",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const data = await registerRequest({
                email: form.email,
                password: form.password,
                username: form.username,
                firstName: form.firstName || undefined,
                lastName: form.lastName || undefined,
                avatar: form.avatar || undefined,
                phone: form.phone || undefined,
                userType: form.userType || "buyer",
            });
            tokenStorage.set(data.token);
            navigate("/profile");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Registration failed"
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

                <h1 className={styles.heading}>Create an account</h1>
                <p className={styles.subheading}>Join Storefront and start buying or selling today</p>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>

                    {/* Required credentials */}
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
                        <label htmlFor="username" className={styles.label}>Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="yourhandle"
                            className={styles.input}
                            required
                            autoComplete="username"
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
                            placeholder="Choose a strong password"
                            className={styles.input}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className={styles.divider} />

                    {/* Optional personal info */}
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label htmlFor="firstName" className={styles.label}>
                                First name
                                <span className={styles.labelOptional}>optional</span>
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="Ada"
                                className={styles.input}
                                autoComplete="given-name"
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="lastName" className={styles.label}>
                                Last name
                                <span className={styles.labelOptional}>optional</span>
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Lovelace"
                                className={styles.input}
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="phone" className={styles.label}>
                            Phone
                            <span className={styles.labelOptional}>optional</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+1 555 000 0000"
                            className={styles.input}
                            autoComplete="tel"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="avatar" className={styles.label}>
                            Avatar URL
                            <span className={styles.labelOptional}>optional</span>
                        </label>
                        <input
                            id="avatar"
                            type="url"
                            name="avatar"
                            value={form.avatar}
                            onChange={handleChange}
                            placeholder="https://example.com/photo.jpg"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.field}>
                        <label htmlFor="userType" className={styles.label}>Account type</label>
                        <select
                            id="userType"
                            name="userType"
                            value={form.userType}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="buyer">Buyer — browse and purchase products</option>
                            <option value="seller">Seller — list and sell products</option>
                            <option value="admin">Admin</option>
                        </select>
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
                                Creating account…
                            </>
                        ) : (
                            <>
                                <i className="ti ti-user-plus" style={{ fontSize: 15 }} aria-hidden="true" />
                                Create account
                            </>
                        )}
                    </button>

                </form>

                <p className={styles.footer}>
                    Already have an account?{" "}
                    <Link to="/login" className={styles.footerLink}>
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}