import bcrypt from "bcryptjs";
import generateToken from "../JWT/generatetoken.js";
import adminToken from "../JWT/admintoken.js"; // Import admin token function
import { sendPasswordChangeEmail } from "../NODEMAILER/nodemailer.js";
import { Emailexist } from "../EMAILEXIST/findemailexist.js";
import User from "../DBmodels/usermodel.js";

// Check User
export const checkuser = async (req, res) => {
  try {
    const user = req.user; // req.user from user middleware
    console.log("data", user);
    const findUser = await User.findOne({ email: user.data });
    if (!findUser) {
      return res.json({ message: "authentication failed", success: false });
    }
    res.json({ message: "authenticateUser", role: findUser.role, success: true });
  } catch (error) {
    console.log(error);
  }
};

/* User Signup */
export const usersignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exist = await Emailexist(email);
    if (exist) {
      console.log("email already used");
      return res.status(400).json({ message: `Email already used in ${exist}`, success: false });
    }

    const isname = await User.findOne({ username });
    if (isname) {
      console.log("user name not available");
      return res.status(401).send({ message: "user name not available", success: false });
    }

    const saltround = 10;
    const hashpassword = await bcrypt.hash(password, saltround);
    const newUser = new User({
      username,
      email,
      hashpassword,
      role: "user",
    });

    const newUsercreated = await newUser.save();

    if (!newUsercreated) {
      console.log("user cannot be saved");
      return res.status(401).send({ message: "user cannot be saved", success: false });
    }
    const token = generateToken(email);

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });
    console.log("signup successfully");
    return res.status(200).send({
      message: "signup successfully",
      username: newUsercreated.username,
      email: newUsercreated.email,
      _id: newUsercreated._id,
      role: newUsercreated.role,
      success: true,
    });
  } catch (error) {
    console.log("user signup error", error);
    return res.status(500).send({ message: "signup failed", error, success: false });
  }
};

/* User Signin */
export const usersignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ message: "User not found", success: false });
    }

    const matchPassword = await bcrypt.compare(password, user.hashpassword);

    if (!matchPassword) {
      console.log("Password is incorrect");
      return res.send({ message: "Password is incorrect", success: false });
    }

    // Generate a token based on the user's role
    let token;
    if (user.role === "admin") {
      // Issue an admin token if the user role is admin
      token = adminToken(user);
      res.cookie("admintoken", token, { httpOnly: true, secure: true, sameSite: "None",success:true });
    } else {
      // Issue a standard token for regular users
      token = generateToken(email);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "None" });
    }

    console.log("Login successful");
    return res.status(200).send({
      message: "Logged in!",
      username: user.username,
      email: user.email,
      _id: user._id,
      role: user.role,
      success: true,
    });
  } catch (error) {
    console.log("Login failed", error);
    res.status(500).send({ message: "Login failed", error, success: false });
  }
};

// Forget Password
export const forgetpassword = async (req, res) => {
  try {
    const { email, newpassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("user not found");
      return res.send({ message: "user not found", success: false });
    }
    const ismatch = await bcrypt.compare(newpassword, user.hashpassword);
    if (ismatch) {
      console.log("password is already used");
      return res.send({ message: "password is already used", success: false });
    }
    const saltround = 10;
    const hashednewpassword = await bcrypt.hash(newpassword, saltround);
    user.hashpassword = hashednewpassword;
    await user.save();

    const Token = generateToken(email);
    res.cookie("token", Token, { httpOnly: true, secure: true, sameSite: "None" });
    await sendPasswordChangeEmail(email, user.username);
    console.log("password change successfully");
    return res.status(200).send({ message: "password change successfully", success: true });
  } catch (error) {
    console.log("password change error", error);
    return res.status(500).send({ message: "password change failed", error, success: false });
  }
};

// Get User
export const getUserName = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    console.log("user get failed", error);
    res.status(500).json({ message: "user get failed", error });
  }
};

// Delete User Account
export const deleteuser = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteusers = await User.deleteOne({ _id: id });

    if (deleteusers.deletedCount === 0) {
      console.log("User not found, cannot be deleted");
      return res.status(404).send({ message: "User not found, cannot be deleted", success: false });
    }

    // Clear the token cookie
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });

    console.log("User account deleted successfully and token cookie cleared");
    return res.status(200).send({ message: "User account deleted successfully", success: true });
  } catch (error) {
    console.log("User deletion failed error", error);
    return res.status(500).send({ message: "User deletion failed error", error, success: false });
  }
};

// Total Users
export const Totalusers = async (req, res) => {
  try {
    const totalusers = await User.countDocuments({});
    res.status(200).json({ message: "total users", totalusers });
  } catch (error) {
    console.log("something error in counting users", error);
    return res.status(500).send({ message: "something error in counting users", error });
  }
};

// Logout User by invalidating the token
export const userLogout = async (req, res) => {
  try {
    // Clear the JWT token from cookies and handle token expiration
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
    res.clearCookie("admintoken", { httpOnly: true, secure: true, sameSite: "None" });

    console.log("User logged out successfully");
    return res.status(200).send({ message: "User logged out successfully", success: true });
  } catch (error) {
    console.log("Logout failed", error);
    return res.status(500).send({ message: "Logout failed", error, success: false });
  }
};
