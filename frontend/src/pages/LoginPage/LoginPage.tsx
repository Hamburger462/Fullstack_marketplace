import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "../../features/auth/api/authApi";
import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

export default function LoginPage() {
    const navigate = useNavigate();

    const { setUser, setToken } = useAuthContext();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const data = await loginRequest({
                email: form.email,
                password: form.password,
            });

            setUser(data.user)
            setToken(data.token);
            navigate("/profile");
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Login failed",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto" }}>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "12px" }}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "8px",
                        }}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: "10px 16px" }}
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: "16px" }}>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
