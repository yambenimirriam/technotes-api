/******* CREATE NEW USER ******/
export const createUser = async (req, res) => {
  // Return a success response indicating that the user was created successfully
  return res.status(201).json({
    success: true,
    message: 'User created successfully',
  });
};

/******* GET ALL USERS ******/
export const getAllUsers = async (req, res) => {
  return res.status(201).json({
    success: true,
    message: 'User created successfully',
  });
};

/******* UPDATE USER ******/
export const updateUser = async (req, res) => {
  return res.status(200).json({ message: 'update user' });
};

/******* DELETE ALL USER ******/
export const deleteUser = async (req, res) => {
  return res.status(200).json({ message: 'delete user' });
};
