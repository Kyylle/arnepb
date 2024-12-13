import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("http://localhost:5000/api/users/login", { email, password });
            // Store token in local storage
            localStorage.setItem("authToken", data.token);
            alert("Login successful!");
            navigate("/dashboard"); // Redirect after login
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div style={{ margin: "50px auto", width: "400px", textAlign: "center" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: "10px" }}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: "10px" }}
                    required
                />
                <button type="submit" style={{ padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none" }}>
                    Login
                </button>
            </form>
            <p>
                Don't have an account? <Link to="/signup" style={{ color: "#007BFF" }}>Sign up</Link>
            </p>
        </div>
    );
};

export default LoginPage;
