import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './dashboard.css';

// Contact interface (TypeScript)
interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

const Dashboard: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [newContact, setNewContact] = useState<Contact>({ _id: "", firstName: "", lastName: "", email: "", phone: "" });
    const [editContact, setEditContact] = useState<Contact | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal visibility
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal visibility

    // Fetch contacts on load
    useEffect(() => {
        const fetchContacts = async () => {
            const token = localStorage.getItem("authToken");
            try {
                const { data } = await axios.get("/api/contacts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContacts(data);
            } catch (err: any) {
                setError("Failed to fetch contacts");
            }
        };

        fetchContacts();
    }, []);

    // Add a new contact
    const handleAddContact = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        try {
            const { data } = await axios.post(
                "/api/contacts/create",
                {
                    firstName: newContact.firstName,
                    lastName: newContact.lastName,
                    email: newContact.email,
                    phone: newContact.phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setContacts([...contacts, data.contact]); // Assuming the response contains 'contact'
            setNewContact({ _id: "", firstName: "", lastName: "", email: "", phone: "" });
            setIsAddModalOpen(false); // Close modal after adding contact
        } catch (err: any) {
            setError("Failed to add contact");
        }
    };

    // Update contact details
    const handleUpdateContact = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editContact) {
            const token = localStorage.getItem("authToken");
            try {
                const { data } = await axios.put(
                    `/api/contacts/update/${editContact._id}`,
                    editContact,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setContacts((prevContacts) =>
                    prevContacts.map((contact) =>
                        contact._id === data._id ? { ...contact, ...data } : contact
                    )
                );
                setEditContact(null);
                setIsEditModalOpen(false); // Close modal after updating contact
            } catch (err: any) {
                setError("Failed to update contact");
            }
        }
    };

    // Delete a contact
    const handleDeleteContact = async (id: string) => {
        const token = localStorage.getItem("authToken");
        const isConfirmed = window.confirm("Are you sure you want to delete this contact?");
        if (!isConfirmed) {
            return;
        }
        try {
            await axios.delete(`/api/contacts/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContacts(contacts.filter((contact) => contact._id !== id));
        } catch (err: any) {
            setError("Failed to delete contact");
        }
    };

    // Filter contacts based on search query
    const filteredContacts = contacts.filter((contact) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
            contact.firstName.toLowerCase().includes(lowerQuery) ||
            contact.lastName.toLowerCase().includes(lowerQuery) ||
            contact.email.toLowerCase().includes(lowerQuery) ||
            contact.phone.startsWith(searchQuery) // For phone number, match from left to right
        );
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <h3>Manage and edit your contacts here</h3>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Button to open Add Contact Modal */}
            <button onClick={() => setIsAddModalOpen(true)}>Add New Contact</button>

            {/* Add Contact Modal */}
            {isAddModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsAddModalOpen(false)}>
                            &times;
                        </span>
                        <h3>Add a new contact</h3>
                        <form onSubmit={handleAddContact}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={newContact.firstName}
                                onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={newContact.lastName}
                                onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newContact.email}
                                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                required
                            />
                            <button type="submit">Add Contact</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Contact Modal */}
            {isEditModalOpen && editContact && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsEditModalOpen(false)}>
                            &times;
                        </span>
                        <h3>Edit Contact</h3>
                        <form onSubmit={handleUpdateContact}>
                            <input
                                type="text"
                                value={editContact.firstName}
                                onChange={(e) => setEditContact({ ...editContact, firstName: e.target.value })}
                            />
                            <input
                                type="text"
                                value={editContact.lastName}
                                onChange={(e) => setEditContact({ ...editContact, lastName: e.target.value })}
                            />
                            <input
                                type="email"
                                value={editContact.email}
                                onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                            />
                            <input
                                type="text"
                                value={editContact.phone}
                                onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                            />
                            <button type="submit">Update Contact</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Contacts Table */}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredContacts.map((contact) => (
                        <tr key={contact._id}>
                            <td>{contact.firstName}</td>
                            <td>{contact.lastName}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td>
                                <button onClick={() => { setEditContact(contact); setIsEditModalOpen(true); }}>Edit</button>
                                <button onClick={() => handleDeleteContact(contact._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
