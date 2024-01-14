import * as argon from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/******* LOGIN ******/
export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec();

  // If no user return an unauthorized response
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Credentials are incorrect',
    });
  }

  // Verify the password against the hashed password stored in the database
  const verifyPassword = await argon.verify(user.password, password);

  // If password verification fails, return an unauthorized response
  if (!verifyPassword) {
    return res.status(401).json({
      success: false,
      message: 'Credentials are incorrect',
    });
  }

  // Generate an access token and a refresh token for the authenticated user
  const access_token = jwt.sign(
    {
      payload: {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: '30min' }
  );

  const refresh_token = jwt.sign(
    {
      payload: {
        id: user._id,
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: '1d' }
  );

  // Set the refresh token as an HTTP-only cookie for secure token refreshing
  res.cookie('jwt', refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 1,
  });

  // Return a success response with the generated token
  return res.status(200).json({ access_token });
};

/******* LOGOUT ******/
export const logout = async (req, res) => {
  return res.status(200).json({ message: 'logout' });
};

/******* REFRESH ******/
export const refresh = async (req, res) => {
  return res.status(200).json({ message: 'refresh' });
};
