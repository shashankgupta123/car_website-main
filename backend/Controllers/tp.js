import User from "../models/user-model.js";
import Movie from "../models/movie-model.js";
import bcrypt from "bcryptjs";

import * as auth from "../middleware/auth.js";
import { log } from "console";

// Public Controller
const signUp = async (req, res) => {
  try {
    const { userName, email, password, image } = req.body;

    if (!email || !password || !userName) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }
    if (password.length < 7) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 7 Characters long",
      });
    }

    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res
        .status(201)
        .json({ success: false, message: "Email Already Registered!" });
    }
    const userExist = await User.findOne({ userName: userName });
    if (userExist) {
      return res
        .status(201)
        .json({ success: false, message: "Username Already Registered!" });
    }

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const Profile_Image =
      PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      image: Profile_Image,
    });

    if (user) {
      auth.generateTokenAndSetCookie(user._id, res);
      res.status(200).json({
        success: true,
        message: {
          ...user._doc,
          password: "",
        },
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log("Error in Registering User ", error.message);
    res.status(500).json({ success: false, message: "Tnternal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are Required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const userToken = auth.generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      sucess: true,
      message: {
        ...user._doc,
        password: "",
        token: userToken,
      },
    });
  } catch (error) {
    console.log("Error While Signing", error.message);
    res.status(500).json({ success: false, message: "Internal Sevrer Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token-CineFilm");
    res.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (error) {
    console.log("Error While doing Logout", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Private Controller
const getCurrentUser = async (req, res) => {
  try {
    const userData = await req.user;
    console.log(userData);
    return res.json({ userData });
  } catch (error) {
    console.log("Error while getting current User", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updatedUser = async (req, res) => {
  try {
    const { userName, email } = req.body;
    let image = req.file ? `/${req.file.filename}` : undefined; // Get the file path from Multer
    log;

    const user = await User.findById(req.params.id);

    if (user) {
      user.userName = userName || user.userName;
      user.email = email || user.email;
      user.image = image || user.image; // If no new image, keep the old one

      const updateUser = await user.save();

      res.json({
        userName: updateUser.userName,
        email: updateUser.email,
        image: updateUser.image,
        isAdmin: updateUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      return res
        .status(200)
        .json({ success: true, message: "Deleted Account Successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
  } catch (error) {
    console.log("Error While Deleting User", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    const comparingPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (comparingPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Password" });
    }
  } catch (error) {
    console.log("Error While Changing Password", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getLikedMovies = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("likedMovies");

    if (user) {
      if (user.likedMovies.length === 0) {
        return res.status(404).json({ message: "No liked movies found" });
      }
      res.json(user.likedMovies);
    } else {
      res.status(404).json({ message: "User not Found" });
    }
  } catch (error) {
    console.log("Error in Getting Favourites:", error.message); // Log error
    res.status(400).json({ message: error.message });
  }
};

const addLikedMovies = async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (user.likedMovies.includes(movieId)) {
        return res
          .status(400)
          .json({ message: "You already Liked this Movie" });
      }

      // Push the movieId to likedMovies
      user.likedMovies.push(movieId);
      await user.save();
      res.json({ success: true, likedMovies: user.likedMovies });
    } else {
      return res.status(404).json({ message: "Movie not Found" });
    }
  } catch (error) {
    console.log("Error While adding Favourites", error.message);
    res.status(400).json({ message: error.message });
  }
};

const emptyFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.likedMovies = [];
      await user.save();
      res.json({ message: "Your Favourites List is now Empty" });
    } else {
      res.status(404);
      throw new Error("Nothing to remove");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const searchData = async (req, res) => {
  try {
    const { query } = req.body;
    const user = await User.findById(req.params.id);
    const movies = await Movie.find({
      name: { $regex: query, $options: "i" },
    });
    console.log("Moviee", movies);
    if (user) {
      if (movies.length > 0 && !user.searchHistory.includes(movies[0].name)) {
        user.searchHistory.push(movies[0].name);
        await user.save();
        return res.status(200).json({ message: movies });
      }
      return res.status(200).json({ message: movies });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error in search", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const viewHistory = async (req, res) => {
  try {
    const { userId, movieId, movieName, category } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the movie already exists in the user's viewMovies array
    const viewIndex = user.viewMovies.findIndex(
      (view) => view.movieId.toString() === movieId.toString()
    );

    if (viewIndex !== -1) {
      // If movie exists, increment the counter
      user.viewMovies[viewIndex].counter += 1;
    } else {
      // If movie doesn't exist in the array, add a new movie object with counter = 1
      const newView = {
        movieId,
        movieName,
        userId,
        category,
        counter: 1,
        createdAt: new Date(),
      };
      user.viewMovies.push(newView);
    }

    // Save the user with the updated viewMovies
    await user.save();

    // Return the updated viewMovies array
    return res.status(200).json({
      message: "Movie view history updated successfully",
      updatedViewMovies: user.viewMovies,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin Controller
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    return res.status(200).json({ success: true, message: users });
  } catch (error) {
    console.log("Error While Getting All Users", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        res
          .status(400)
          .json({ success: false, message: "Cannot Delete Admin Users" });
      }
      await user.deleteOne();
      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
  } catch (error) {
    console.log("Error While Admin Deleting users", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export {
  signUp,
  login,
  logout,
  getCurrentUser,
  updatedUser,
  updatePassword,
  deleteUser,
  viewHistory,
  getUsers,
  deleteUsers,
  getLikedMovies,
  addLikedMovies,
  emptyFavourites,
  searchData,
};
