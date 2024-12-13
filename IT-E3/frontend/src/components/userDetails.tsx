import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
}

const UserDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get<User>(`http://localhost:5000/api/users/${id}`);
                setUser(data);
            } catch (err) {
                console.error('Error fetching user:', err);
            }
        };
        fetchUser();
    }, [id]);

    return (
        <div className="curved-background">
            <div className="content">
                <div className="user-container1">
                    <h1>User Details</h1>
                    {user ? (
                        <div className="user-details">
                            <p><strong>First Name:</strong> {user.firstName}</p>
                            <p><strong>Last Name:</strong> {user.lastName}</p>
                            <p><strong>Username:</strong> {user.userName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;