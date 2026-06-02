import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

export default function ProfilePage() {
  const navigate = useNavigate();

  const { user, deleteToken } = useAuthContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load profile"
      );

      deleteToken();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = () => {
    deleteToken()
    navigate("/login");
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading profile...</p>;
  }

  if (error) {
    return <p style={{ padding: "20px", color: "red" }}>{error}</p>;
  }

  if (!user) {
    return <p style={{ padding: "20px" }}>No user data</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h1>Profile</h1>

      {user.avatar && (
        <img
          src={user.avatar}
          alt="avatar"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "50%",
            marginBottom: "16px",
          }}
        />
      )}

      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>First name:</strong> {user.first_name || "-"}</p>
      <p><strong>Last name:</strong> {user.last_name || "-"}</p>
      <p><strong>Phone:</strong> {user.phone || "-"}</p>
      <p><strong>User type:</strong> {user.user_type}</p>
      <p><strong>Created date:</strong> {user.created_date}</p>

      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px 16px" }}
      >
        Logout
      </button>
    </div>
  );
}