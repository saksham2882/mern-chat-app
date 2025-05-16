import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs/promises';

// Register user
export const register = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: 'Please fill all the fields.', success: false });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.', success: false });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists.', success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullName,
      username,
      password: hashedPassword,
      profilePhoto: gender === 'male' ? maleProfilePhoto : femaleProfilePhoto,
      gender,
    });

    return res.status(201).json({
      message: 'User created successfully.', success: true, user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePhoto: newUser.profilePhoto,
      }
    });
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error.', success: false });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Please fill all the fields.', success: false });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found.', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect Password.', success: false });
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      })
      .json({
        message: 'Login successful.', success: true,
        user: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
          profilePhoto: user.profilePhoto,
        },
      });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', success: false });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie('token', '', {
        httpOnly: true,
        maxAge: 0,
        sameSite: 'strict',
      })
      .json({ message: 'Logout successful.', success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', success: false });
  }
};

// Get other Users
export const getOtherUsers = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const otherUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select('-password')
      .sort({ createdAt: -1 });
    return res.status(200).json({ message: 'Users fetched successfully.', success: true, otherUsers });
  }
  catch (error) {
    return res.status(500).json({ message: 'Server error.', success: false });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const userId = req.id;
    const { fullName, username, gender, password } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.', success: false });
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists.', success: false });
      }
    }
    
    if (profilePhoto) {
      try {
        const extension = path.extname(profilePhoto.originalname);
        const publicId = `chat-app/${username}${extension}`;
        const uploadResult = await cloudinary.uploader.upload(profilePhoto.path, {
          folder: 'chat-app',
          public_id: publicId,
          width: 200,
          height: 200,
          crop: 'fill',
        });

        // console.log('Upload Result:', uploadResult);
        user.profilePhoto = uploadResult.secure_url;
        await fs.unlink(profilePhoto.path);
      } 
      catch (uploadError) {
        return res.status(500).json({ message: 'Failed to upload image.', success: false });
      }
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (username) user.username = username;
    if (gender) user.gender = gender;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully.',
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePhoto: user.profilePhoto,
        gender: user.gender,
      },
    });
  } 
  catch (error) {
    // console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error.', success: false });
  }
};