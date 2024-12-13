

import express from 'express';
import { createUser, deleteUser, getUsers, loginUser, updateUser } from '../Controllers/userController.js';

const router = express.Router();

// Generate JWT
// const generateToken = (id) => {
//     return jwt.sign({ id }, "secretKey", { expiresIn: "1h" });
// };

// Middleware to protect routes
// const protect = async (req, res, next) => {
//     let token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     try {
//         const decoded = jwt.verify(token, "secretKey");
//         req.user = await User.findById(decoded.id).select("-password");
//         next();
//     } catch {
//         res.status(401).json({ message: "Unauthorized" });
//     }
// };

// // Login Route
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     if (user && (await user.matchPassword(password))) {
//         res.json({
//             token: generateToken(user._id),
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//             },
//         });
//     } else {
//         res.status(401).json({ message: "Invalid email or password" });
//     }
// });

// // Create User
// router.post("/", async (req, res) => {
//     try {
//         const { firstName, lastName, userName, email, password, isAdmin } = req.body;
//         const user = await User.create({ firstName, lastName, userName, email, password, isAdmin });
//         res.status(201).json(user);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // Get All Users (Protected)
// router.get("/", protect, async (req, res) => {
//     const users = await User.find();
//     res.json(users);
// });

router.get('/', getUsers);
router.post('/create', createUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.post('/login', loginUser);

export default router;
