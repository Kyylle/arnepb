import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navigation: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        alert("Logged out successfully!");
        navigate("/login");
    };

    const isLoggedIn = !!localStorage.getItem("authToken");

    return (
        <nav>
            <Link to="/">Home</Link>
            {isLoggedIn ? (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navigation;
