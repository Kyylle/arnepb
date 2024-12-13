import express from 'express'
import { addContact, deleteContact, getContacts, updateContact } from '../Controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';



const router = express.Router();

router.get('/',protect, getContacts);
router.post('/create',protect, addContact);
router.put('/update/:id',protect, updateContact);
router.delete('/delete/:id',protect, deleteContact);
export default router;