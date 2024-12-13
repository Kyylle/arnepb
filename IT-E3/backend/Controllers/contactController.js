import asyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';
// import User from '../models/Users.js';
// Controller for adding a new contact with a phone number
export const addContact = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  // Ensure userId is available (from the protect middleware)
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  // Check if all required fields are provided
  if (!firstName || !lastName || !phone) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if the phone number already exists for this user
  const existingContact = await Contact.findOne({ phone, userId: req.user.id });
  if (existingContact) {
    return res.status(400).json({ message: 'Contact with this phone number already exists' });
  }

  // Create the new contact
  const contact = new Contact({
    userId: req.user.id, // Set the userId from the authenticated user
    firstName,
    lastName,
    email,
    phone,
  });

  await contact.save();

  res.status(201).json({
    message: 'Contact added successfully',
    contact,
  });
});

export const updateContact = asyncHandler(async (req, res) => {
    const { id } = req.params; // The contact ID from the URL
    const { firstName, lastName, email, phone } = req.body;
  
    // Find the contact by ID
    const contact = await Contact.findById(id);
  
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
  
    // Update the fields of the contact
    contact.firstName = firstName || contact.firstName;
    contact.lastName = lastName || contact.lastName;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
  
    // Save the updated contact
    const updatedContact = await contact.save();
  
    res.json({
      message: 'Contact updated successfully',
      contact: updatedContact,
    });
});

export const deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params; // The contact ID from the URL
  
    // Find the contact by ID and delete it
    const contact = await Contact.findByIdAndDelete(id);
  
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
  
    res.json({ message: 'Contact deleted successfully' });
});

export const getContacts = asyncHandler(async (req, res) => {
    try {
      // Fetch all contacts from the database
      const contacts = await Contact.find(); // No userId filter
  
      res.json(contacts); // Return all contacts
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve contacts' });
    }
  });