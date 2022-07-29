const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const bcrypt = require("bcryptjs");

//Register
const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

//Login
const login = async (req, res) => {
  const { email, password } = req.body;
  //check valid email & password
  if (!password || !email) {
    throw new BadRequestError("Plese Provide Email & Password");
  }
  const user = await User.findOne({ email });

  //verify user
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials !");
  }

  //verify password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new UnauthenticatedError("Invalid Credentials !");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
