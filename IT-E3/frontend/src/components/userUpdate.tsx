import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the User type
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

const UserUpdate: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get user ID from route params
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get<User>(`http://localhost:5000/api/users/${id}`);
                setUser(data);
            } catch (err) {
                setError('User not found');
            }
        };
        fetchUser();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (user) {
            setUser({
                ...user,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSaveClick = async () => {
        if (user) {
            try {
                // Update user in MongoDB
                await axios.put(`http://localhost:5000/api/users/${user._id}`, {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                });

                // Update the user in localStorage
                localStorage.setItem(`user_${user._id}`, JSON.stringify(user));

                // Redirect to user details page
                navigate(`/user/${user._id}`); // Redirect to the user details page
            } catch (error) {
                setError("Error saving user");
            }
        }
    };

    if (error) {
        return <p className="error-message">Error: {error}</p>;
    }

    return user ? (
        <div className="update-container">
            <h1>Update User</h1>
            <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
            />
            <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
            />
            <button onClick={handleSaveClick}>Save</button>
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default UserUpdate;
