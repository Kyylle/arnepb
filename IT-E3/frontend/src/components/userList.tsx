import React, { useState, useEffect } from "react";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import './confirm.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    isAdmin: boolean;
    password: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Unauthorized! Please log in.');
                window.location.href = '/login';
                return;
            }

            try {
                const { data } = await axios.get("/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(data);
            } catch (error) {
                console.error("There was an error fetching the users!", error);
                alert("Failed to fetch users. Please log in again.");
                window.location.href = '/login';
            }
        };

        fetchUsers();
    }, []);

    // Handle edit user
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        localStorage.setItem('selectedUser', JSON.stringify(user)); // Store in localStorage
    };

    // Handle update user
    const handleUpdate = async () => {
        if (selectedUser) {
            const token = localStorage.getItem('authToken');
            try {
                await axios.put(`/api/users/${selectedUser._id}`, selectedUser, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("User updated successfully");
                // Refresh users list
                const { data } = await axios.get("/api/users", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(data);
                setSelectedUser(null); // Clear the form
                localStorage.removeItem('selectedUser');
            } catch (error) {
                console.error("There was an error updating the user!", error);
                alert("Failed to update user.");
            }
        }
    };

    // Handle delete user
    const handleDeleteClick = async (id: string) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        const token = localStorage.getItem('authToken');
                        try {
                            await axios.delete(`/api/users/${id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            setUsers(users.filter(user => user._id !== id));
                            alert('User deleted successfully');
                        } catch (error) {
                            console.error('Error deleting user:', error);
                            alert('Failed to delete user.');
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { } // Do nothing on cancel
                }
            ]
        });
    };

    // Retrieve selected user from localStorage on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('selectedUser');
        if (savedUser) {
            setSelectedUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <div className="container">
            <h1>User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <span>{user.firstName} {user.lastName} - {user.email}</span>
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDeleteClick(user._id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div>
                    <h2>Edit User</h2>
                    <form>
                        <input
                            type="text"
                            value={selectedUser.firstName}
                            onChange={e => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                            placeholder="First Name"
                        />
                        <input
                            type="text"
                            value={selectedUser.lastName}
                            onChange={e => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                            placeholder="Last Name"
                        />
                        <input
                            type="email"
                            value={selectedUser.email}
                            onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            value={selectedUser.userName}
                            onChange={e => setSelectedUser({ ...selectedUser, userName: e.target.value })}
                            placeholder="Username"
                        />
                        <button type="button" onClick={handleUpdate}>Update</button>
                        <button type="button" onClick={() => handleDeleteClick(selectedUser._id)}>Delete</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserList;
