import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../shared/hooks/useAuthContext/useAuthContext";

import styles from "./ProfilePage.module.css";

function getInitials(user: { first_name?: string; last_name?: string; username?: string }): string {
    if (user.first_name && user.last_name) {
        return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.username) return user.username.slice(0, 2).toUpperCase();
    return "?";
}

function ProfileSkeleton() {
    return (
        <div className={styles.inner}>
            <div className={styles.skelHeaderCard}>
                <div className={`${styles.skel} ${styles.skelAvatar}`} />
                <div className={styles.skelHeaderLines}>
                    <div className={`${styles.skel} ${styles.skelName}`} />
                    <div className={`${styles.skel} ${styles.skelUname}`} />
                    <div className={`${styles.skel} ${styles.skelEmail}`} />
                </div>
            </div>

            <div className={styles.skelInfoCard}>
                <div className={`${styles.skel} ${styles.skelInfoTitle}`} />
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.skelRow}>
                        <div className={`${styles.skel} ${styles.skelRowIcon}`} />
                        <div className={`${styles.skel} ${styles.skelRowLabel}`} />
                        <div className={`${styles.skel} ${styles.skelRowValue}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

type InfoRowProps = {
    icon: string;
    label: string;
    value?: string | null;
};

function InfoRow({ icon, label, value }: InfoRowProps) {
    return (
        <div className={styles.row}>
            <span className={styles.rowIcon}>
                <i className={`ti ${icon}`} aria-hidden="true" />
            </span>
            <span className={styles.rowLabel}>{label}</span>
            <span className={`${styles.rowValue} ${!value ? styles.rowValueMuted : ""}`}>
                {value || "—"}
            </span>
        </div>
    );
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, deleteToken } = useAuthContext();

    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

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
        deleteToken();
        navigate("/login");
    };

    const displayName =
        user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : user?.username ?? "";

    if (loading) return (
        <div className={styles.page}>
            <ProfileSkeleton />
        </div>
    );

    if (error) return (
        <div className={styles.page}>
            <div className={styles.inner}>
                <p style={{ color: "#A32D2D", fontSize: 14 }}>{error}</p>
            </div>
        </div>
    );

    if (!user) return (
        <div className={styles.page}>
            <div className={styles.inner}>
                <p style={{ fontSize: 14, color: "#999" }}>No user data available.</p>
            </div>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.inner}>

                {/* ── Header card ── */}
                <div className={styles.headerCard}>
                    <div className={styles.avatarWrap}>
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {getInitials(user)}
                            </div>
                        )}
                        {user.user_type && (
                            <span className={styles.userTypeBadge}>
                                {user.user_type}
                            </span>
                        )}
                    </div>

                    <div className={styles.headerInfo}>
                        <div className={styles.displayName}>{displayName}</div>
                        {user.username && (
                            <div className={styles.username}>@{user.username}</div>
                        )}
                        <div className={styles.email}>
                            <i className="ti ti-mail" style={{ fontSize: 13 }} aria-hidden="true" />
                            {user.email}
                        </div>
                    </div>

                    <button className={styles.btnLogout} onClick={handleLogout}>
                        <i className="ti ti-logout" style={{ fontSize: 13 }} aria-hidden="true" />
                        Log out
                    </button>
                </div>

                {/* ── Personal info ── */}
                <div className={styles.infoCard}>
                    <div className={styles.infoCardTitle}>Personal information</div>
                    <InfoRow icon="ti-id-badge"   label="ID"           value={user.id} />
                    <InfoRow icon="ti-user"        label="First name"   value={user.first_name} />
                    <InfoRow icon="ti-user"        label="Last name"    value={user.last_name} />
                    <InfoRow icon="ti-phone"       label="Phone"        value={user.phone} />
                </div>

                {/* ── Account info ── */}
                <div className={styles.infoCard}>
                    <div className={styles.infoCardTitle}>Account</div>
                    <InfoRow icon="ti-at"          label="Username"     value={user.username} />
                    <InfoRow icon="ti-mail"        label="Email"        value={user.email} />
                    <InfoRow icon="ti-shield"      label="Role"         value={user.user_type} />
                    <InfoRow icon="ti-calendar"    label="Member since" value={user.created_date} />
                </div>

            </div>
        </div>
    );
}