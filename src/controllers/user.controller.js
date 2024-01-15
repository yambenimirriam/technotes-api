import * as argon from 'argon2';
import User from '../models/User.js';

/******* CREATE NEW USER ******/
export const createUser = async (req, res) => {
  const { username, password, roles, active } = req.body;
  const user = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // If a user with the same username exists, return a conflict response
  if (user) {
    return res.status(409).json({
      success: false,
      message: 'Username already taken',
    });
  }

  // Hash the provided password using Argon2
  const hashedPassword = await argon.hash(password);

  // Create a new user record in the database with the hashed password
  const newUser = await User.create({
    username: username,
    password: hashedPassword,
    active: active,
    roles: roles,
  });

  // If user creation fails, return a bad request response
  if (!newUser) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user data received',
    });
  }

  // Return a success response indicating that the user was created successfully
  return res.status(201).json({
    success: true,
    message: 'User created successfully',
  });
};

/******* GET ALL USERS ******/
export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').lean();

  // Check if any users were found
  if (!users?.length) {
    return res.status(404).json({
      success: false,
      message: 'No users found',
    });
  }

  // Return a success response with the list of users
  return res.status(200).json(users);
};

/******* UPDATE USER ******/
export const updateUser = async (req, res) => {
  return res.status(200).json({ message: 'update user' });
};

/******* DELETE ALL USER ******/
export const deleteUser = async (req, res) => {
  return res.status(200).json({ message: 'delete user' });
};
