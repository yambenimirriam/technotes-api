/******* LOGIN ******/
export const login = async (req, res) => {
  return res.status(200).json({ message: 'login' });
};

/******* LOGOUT ******/
export const logout = async (req, res) => {
  return res.status(200).json({ message: 'logout' });
};

/******* REFRESH ******/
export const refresh = async (req, res) => {
  return res.status(200).json({ message: 'refresh' });
};
