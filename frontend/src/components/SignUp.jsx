import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { API_BASE_URL } from '../config';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const inputVariants = {
  focus: { scale: 1.02, boxShadow: "2px 0px 4px rgba(59, 130, 246, 0.5)" },
};

const SignUp = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenderChange = (e) => {
    setUser({ ...user, gender: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/register`,
        user,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-gray-900 to-black"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-md p-8 backdrop-blur-lg rounded-2xl border border-gray-600 shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-100 text-center mb-6">
          Sign Up
        </h1>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Full Name</label>
            <motion.input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-blue-600"
              type="text"
              placeholder="Enter full name"
              required
              whileFocus="focus"
              variants={inputVariants}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Username</label>
            <motion.input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-blue-600"
              type="text"
              placeholder="Enter username"
              required
              whileFocus="focus"
              variants={inputVariants}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Password</label>
            <motion.input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-blue-600"
              type="password"
              placeholder="Enter password"
              required
              whileFocus="focus"
              variants={inputVariants}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <motion.input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-blue-600"
              type="password"
              placeholder="Confirm password"
              required
              whileFocus="focus"
              variants={inputVariants}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Gender</label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="radio"
                  value="male"
                  checked={user.gender === "male"}
                  onChange={handleGenderChange}
                  className="radio radio-primary"
                  required
                />
                <span className="ml-2">Male</span>
              </label>

              <label className="flex items-center text-gray-300">
                <input
                  type="radio"
                  value="female"
                  checked={user.gender === "female"}
                  onChange={handleGenderChange}
                  className="radio radio-primary"
                  required
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Creating account..." : "Create account"}
          </motion.button>

          <p className="text-center text-gray-300 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
          
        </form>
      </div>
    </motion.div>
  );
};

export default SignUp;
