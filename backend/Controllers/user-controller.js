import User from "../Models/user-models.js";
import bcrypt from "bcryptjs";
import { signupSchema,loginSchema} from "../middleware/user-validation.js"
import { z, ZodError } from "zod";
import Car from "../Models/car.js";

// Public Controller
const register = async (req, res, next) => {
  try {
      const { username, email, phone, password } = signupSchema.parse(req.body);
      const userExist = await User.findOne({ email });
      if (userExist) {
          return res.status(400).json({ message: "Email already registered" });
      }

      const PROFILE_PICS = ["/default-images/avatar1.png", "/default-images/avatar2.png", "/default-images/avatar3.png"];
      const profileImage = req.file ? `/uploads/profile-pics/${req.file.filename}` : PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
  
      const userCreated = await User.create({
          username,
          email,
          phone,
          password,
          image:profileImage,
          dayUsage: new Map(),
      });
      res.status(201).json({
          message: "Registration successful!",
          token: await userCreated.generateToken(),
          userId: userCreated._id.toString(),
      });
   } 
  catch (error) {
      if (error instanceof ZodError) {
          return res.status(400).json({
              message: error.errors[0].message,
          });
      }
      console.error("Error during registration:", error);
      return res.status(500).json({
          message: "Registration failed. Please try again later.",
      });
  }
};

const login = async (req, res, next) => {
  try {
      const { email, password } = loginSchema.parse(req.body);
      const userExist = await User.findOne({ email: email.trim().toLowerCase() });
      if (!userExist) {
          return res.status(400).json({ message: "Invalid Credentials" });
      }
      const isPasswordValid = await userExist.comparePassword(password);
      if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid Email and Password" });
      }

      userExist.currentLogin = new Date();
      await userExist.save();

      const token = await userExist.generateToken();
      console.log("Token generated", token);
      return res.status(200).json({
          message: "Login Successful",
          token: token,
          userId: userExist._id.toString(),
          username: userExist.username,
          email: userExist.email,
          admin:userExist.admin,
          phone:userExist.phone,
      });
  } catch (error) {
      if (error instanceof ZodError) {
          return res.status(400).json({
              message: error.errors[0].message,  
          });
      }
      console.log("Login Error", error);
      next(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Old Password Hash:", user.password);

    // Use the same hashing method as during registration
    user.password = newPassword; // Assuming pre-save middleware handles hashing

    // Save the updated user object
    await user.save();

    console.log("Updated Password Hash in DB:", user.password);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// GET ALL USERS 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({
      message: "Users fetched successfully",
      users: users,
    });
  } catch (error) {
    console.log("Error fetching all users:", error);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};

const logout = async (req, res) => {
  try {
    const { userId } = req.body; // Pass the userId in the request body
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const logoutTime = new Date();
    const loginTime = new Date(user.currentLogin);
    const timeSpentMs = logoutTime - loginTime;

    // Calculate hours and minutes spent
    const timeSpentHours = Math.floor(timeSpentMs / (1000 * 60 * 60));
    const timeSpentMinutes = Math.floor((timeSpentMs % (1000 * 60 * 60)) / (1000 * 60));

    // Determine the day of the week
    const dayOfWeek = loginTime.toLocaleString('en-US', { weekday: 'long' });

    // Update the cumulative time in `dayUsage`
    if (user.dayUsage.has(dayOfWeek)) {
      const [existingHours, existingMinutes] = user.dayUsage
        .get(dayOfWeek)
        .split(' ')
        .filter((item) => !isNaN(item))
        .map(Number);

      const totalMinutes = existingMinutes + timeSpentMinutes;
      const totalHours = existingHours + timeSpentHours + Math.floor(totalMinutes / 60);

      const newTime = `${totalHours} hours ${totalMinutes % 60} minutes`;
      user.dayUsage.set(dayOfWeek, newTime);
    } else {
      const sessionTime = `${timeSpentHours} hours ${timeSpentMinutes} minutes`;
      user.dayUsage.set(dayOfWeek, sessionTime);
    }

    // Clear current login time
    user.currentLogin = null;
    await user.save();

    res.clearCookie("authToken");
    res.status(200).json({
      success: true,
      message: "Successfully logged out",
      dayUsage: user.dayUsage,
    });
  } catch (error) {
    console.log("Error while logging out", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Assuming you're using express and mongoose
const adminlogout = async (req, res) => {
  try {
    const { userId } = req.body; // Pass the userId in the request body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Assuming you are using MongoDB/Mongoose to fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Perform any logout actions like clearing session, token, etc.
    res.clearCookie('auth_token'); // Clearing the token (if you use cookies)

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log("Error while logging out", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Private Controller 
const getCurrentUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, userData: user });
  } catch (error) {
    console.log("Error while getting current user", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updatedUser = async (req, res) => {
  try {
    const { userName, phone } = req.body;  
    const { email } = req.query;  

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.userName = userName || user.userName; 
    user.phone = phone || user.phone;  
    const updatedUser = await user.save();
    res.json({
      userName: updatedUser.userName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    console.log("Error while updating user", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
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
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log("Error while changing password", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const searchData = async (req, res) => {
  try {
    const { query, email } = req.body; 
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query cannot be empty" });
    }
    const user = await User.findOne({ email }); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cars = await Car.find({
      name: { $regex: query, $options: "i" }, 
    });

    if (cars.length > 0) {
      const firstCarName = cars[0].name; 
      user.searchhistory.push(firstCarName);
    } else {
      user.searchhistory.push(query);
    }

    const updatedUser = await user.save(); 
    console.log("Cars found:", cars); 
    return res.status(200).json({ message: "Search results found", cars, user: updatedUser });
  
  } catch (error) {
    console.error("Error in search:", error.message); 
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const recordCarVisit = async (req, res) => {
  try {
    const { userId, carId, carName, variant, description, offers, model_no, colors, locations } = req.body;
    console.log("Request body:", req.body);

    if (!userId || !carId || !carName || !variant || !description || !offers || !model_no || !colors || !locations) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found.`);
      return res.status(404).json({ message: "User not found." });
    }

    const carIndex = user.carvisited.findIndex((car) => car.name === carName);
    if (carIndex >= 0) {
      user.carvisited[carIndex].visitCount += 1;

      // Ensure locations is an array and add only unique values
      const existingLocations = user.carvisited[carIndex].locations || [];
      user.carvisited[carIndex].locations = [...new Set([...existingLocations, locations])];
    } else {
      user.carvisited.push({
        name: carName,
        variant,
        description,
        visitCount: 1,
        offers,
        model_no,
        colors: colors.map(color => ({
          color: color.color,
          price: color.price,
          images: color.images,
        })),
        locations: Array.isArray(locations) ? locations : [locations], // Ensure locations is always an array
      });
    }

    const result = await user.save();
    console.log("User saved:", result);
    res.status(200).json({ message: "Car visit recorded successfully.", carVisited: user.carvisited });
  } catch (error) {
    console.error("Error recording car visit:", error.message);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

const addFavourite = async (req, res) => {
  const { userId, carDetails } = req.body;
  console.log("Received carDetails:", carDetails);

  try {
      if (!carDetails || !carDetails.name || !carDetails.model_no) {
          return res.status(400).json({ message: 'Invalid car data' });
      }
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const carAlreadyInFavorites = user.favourites.some(car => car.model_no === carDetails.model_no);
      if (carAlreadyInFavorites) {
          return res.status(400).json({ message: 'Car is already in your favorites' });
      }
      const selectedColorDetails = carDetails.colors[0]; 

      if (!selectedColorDetails) {
          return res.status(400).json({ message: 'Invalid color selected' });
      }
      const carToAdd = {
          name: carDetails.name,
          model_no: carDetails.model_no,
          variant: carDetails.variant,
          mileage: carDetails.mileage,
          description: carDetails.description,
          offers: carDetails.offers,
          colors: [selectedColorDetails], 
      };
      user.favourites.push(carToAdd);
      await user.save();

      return res.status(200).json({ message: 'Car added to favorites successfully' });
  } catch (error) {
      console.error('Error adding favorite:', error);
      return res.status(500).json({ message: 'Error adding car to favorites' });
  }
};

export {
  register,
  login,
  logout,
  getCurrentUser,
  updatedUser,
  updatePassword,
  getAllUsers,
  searchData,
  recordCarVisit,
  addFavourite,
  adminlogout,
  resetPassword,
};
