import { useNavigate } from "react-router-dom";
import styles from "./AccessDeniedPage.module.css";

export default function AccessDeniedPage() {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            {/* Styled icon container matching your homepage feature style */}
            <div className={styles.iconContainer}>
                🔒
            </div>
            
            <h1 className={styles.title}>Access Denied</h1>
            
            <p className={styles.description}>
                You don't have permission to access this page. If you think this is a mistake, please contact your administrator.
            </p>
            
            <button 
                className={styles.btnPrimary} 
                onClick={() => navigate("/profile")}
            >
                Back to profile
            </button>
        </div>
    );
}