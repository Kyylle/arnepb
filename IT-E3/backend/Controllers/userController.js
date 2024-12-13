import User from '../models/userModel.js'; 
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, userName } = req.body;

  if (!userName) {
    res.status(400);
    throw new Error('Username is required');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    userName,
  });

  if (user) {
    const token = generateToken(user._id);
    console.log('Signup Token:', token); // Log the token during signup
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userName: user.userName,
      token, // Return the token in the response
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id);
    console.log('Login Token:', token); // Log the token during login
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userName: user.userName,
      token, // Return the token in the response
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10); 
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser };
