import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate

// Define the User interface matching the form fields
interface User {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

const UserCreate: React.FC = () => {
    // const navigate = useNavigate();
    const [user, setUser] = useState<User>({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        isAdmin: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle form submission to create a new user
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data } = await axios.post('/api/users/create', user);
            const { err, message } = data;
            setIsSubmitting(false);
            if (err) {
                alert(message);
            } 
            
        } catch (error: any) {
            setIsSubmitting(false);
            alert(error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create User</h1>
            <input
                type="text"
                name="firstName" // Add name attribute for handling change
                placeholder="First Name"
                value={user.firstName} // Access the state value
                onChange={handleInputChange} // Use the shared change handler
                required
            />
            <input
                type="text"
                name="lastName" // Add name attribute for handling change
                placeholder="Last Name"
                value={user.lastName} // Access the state value
                onChange={handleInputChange} // Use the shared change handler
                required
            />
            <input
                type="text"
                name="userName" // Add name attribute for handling change
                placeholder="Username"
                value={user.userName} // Access the state value
                onChange={handleInputChange} // Use the shared change handler
                required
            />
            <input
                type="email"
                name="email" // Add name attribute for handling change
                placeholder="Email"
                value={user.email} // Access the state value
                onChange={handleInputChange} // Use the shared change handler
                required
            />
            <input
                type="password"
                name="password" // Add name attribute for handling change
                placeholder="Password"
                value={user.password} // Access the state value
                onChange={handleInputChange} // Use the shared change handler
                required
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
        </form>
    );
};

export default UserCreate;

