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
/**********=== GENERATE REFRESH TOKEN **********/
export const refresh = async (req, res) => {
  const cookies = req.cookies;

  // Check if a refresh token is present in the cookies
  if (!cookies?.jwt) {
    return res.status(401).json({
      success: false,
      message: 'Credentials are incorrect',
    });
  }

  // Extract the refresh token from the cookies
  const refresh_token = cookies.jwt;

  try {
    // Verify the refresh token's validity and decode its payload
    const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET_KEY);

    // Check if the user associated with the refresh token exists
    const user = await User.findOne({ email: decoded.payload.email })
      .collation({ locale: 'en', strength: 2 })
      .lean()
      .exec();

    // If no user is found, return an unauthorized response
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credentials are incorrect',
      });
    }

    // Generate a new access token and return it as a response
    const access_token = jwt.sign(
      {
        payload: {
          id: user._id,
          email: user.email,
        },
      },
      process.env.JWT_ACCESS_SECRET_KEY,
      { expiresIn: '15min' }
    );

    return res.status(200).json({ access_token });
  } catch (error) {
    // If an error occurs during token verification, return a forbidden response
    return res.status(403).json({ message: 'Forbidden' });
  }
};

/**********=== LOGOUT USER **********/
export const logout = async (req, res) => {
  const cookies = req.cookies;

  // If no JWT cookie is present, send a no content response
  if (!cookies?.jwt) return res.sendStatus(204);

  // Clear the JWT cookie to log the user out
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  // Send a JSON response indicating that the cookie has been cleared
  res.json({ message: 'Cookie cleared' });
};
