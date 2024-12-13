import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

const SignupPage: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("http://localhost:5000/api/users/create", {
                name,
                email,
                password,
                userName,
            });
            // Store token in local storage
            localStorage.setItem("authToken", data.token);
            alert("Signup successful!");
            navigate("/dashboard"); // Redirect after signup
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div style={{ margin: "50px auto", width: "400px", textAlign: "center" }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: "10px" }}
                    required
                />
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
                <input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{ padding: "10px" }}
                    required
                />
                <button type="submit" style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none" }}>
                    Sign Up
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login" style={{ color: "#007BFF" }}>Login</Link>
            </p>
        </div>
    );
};

export default SignupPage;
