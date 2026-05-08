import { useNavigate } from "react-router-dom"

export default function AccessDeniedPage(){
    const navigate = useNavigate();

    return(
    <>
        <div>You have no access to this page</div>
        <button onClick={() => {
            navigate("/profile");
        }}>Back to profile</button>
    </>
    )
}