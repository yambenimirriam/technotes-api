import * as argon from 'argon2';
import Note from '../models/Note.js';
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
  const id = req.params.id;
  const { username, roles, active, password } = req.body;

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await argon.hash(password);
  }

  const updatedUser = await user.save();
  // If user update fails, return a bad request response
  if (!updatedUser) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user data received',
    });
  }

  return res.status(200).json({ message: 'updated user' });
};

/******* DELETE ALL USER ******/
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  // Does the user still have assigned notes?
  const note = await Note.findOne({ userId: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: 'User has assigned notes' });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const result = await user.deleteOne();
  // If user deletion fails, return a bad request response
  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Error occured',
    });
  }
  return res.status(200).json({ message: 'delete user' });
};
