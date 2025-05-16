import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { API_BASE_URL } from '../config';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const inputVariants = {
  focus: { scale: 1.02, boxShadow: "0px 0px 8px rgba(76, 175, 80, 0.5)" },
};

const ProfileModal = ({ onClose }) => {
  const { authUser } = useSelector((store) => store.user);
  const [user, setUser] = useState({
    fullName: authUser?.fullName || "",
    username: authUser?.username || "",
    gender: authUser?.gender || "",
    password: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(authUser?.profilePhoto || "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleGenderChange = (e) => {
    setUser({ ...user, gender: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB.");
        return;
      }

      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("username", user.username);
      formData.append("gender", user.gender);
      if (user.password) formData.append("password", user.password);
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await axios.put(
        `${API_BASE_URL}/api/v1/user/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success("Profile updated successfully");
      dispatch(setAuthUser(res.data.user));
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative w-full max-w-md p-6 bg-gray-800 rounded-lg border border-gray-600 max-md:p-4 max-md:max-w-sm max-sm:p-4 max-sm:max-w-[90%]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-100 cursor-pointer"
        >
          <IoClose size={24} className="max-md:size-8 max-sm:size-7" />
        </button>

        <h1 className="text-2xl font-semibold text-gray-100 text-center mb-6 max-md:text-xl max-sm:text-lg">
          Edit Profile
        </h1>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4 max-md:mb-3 max-sm:mb-2">
            <label className="block text-gray-300 mb-2 max-md:text-sm max-sm:text-xs">
              Full Name
            </label>
            <motion.input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full p-3 bg-gray-700 border-0 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 max-md:p-2 max-md:text-sm max-sm:p-2 max-sm:text-xs"
              type="text"
              placeholder="Enter full name"
              required
              whileFocus="focus"
              variants={inputVariants}
            />
          </div>

          <div className="mb-4 max-md:mb-3 max-sm:mb-2">
            <label className="block text-gray-300 mb-2 max-md:text-sm max-sm:text-xs">
              Username
            </label>
            <motion.input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full p-3 bg-gray-700 border-0 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 max-md:p-2 max-md:text-sm max-sm:p-2 max-sm:text-xs"
              type="text"
              placeholder="Enter username"
              required
              whileFocus="focus"
              variants={inputVariants}
            />
          </div>

          <div className="mb-4 max-md:mb-3 max-sm:mb-2">
            <label className="block text-gray-300 mb-2 max-md:text-sm max-sm:text-xs">
              Profile Photo
            </label>
            <div className="flex items-center gap-4 max-md:gap-2 max-sm:gap-2">
              <div className="w-16 h-14 rounded-full overflow-hidden border-2 border-gray-400">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-gray-700 file-input file-input-bordered w-full max-md:text-sm max-sm:text-xs"
                whileFocus="focus"
                variants={inputVariants}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 max-md:text-[10px] max-sm:text-[10px]">
              Upload an image (max 5MB, JPG/PNG).
            </p>
          </div>

          <div className="mb-4 max-md:mb-3 max-sm:mb-2">
            <label className="block text-gray-300 mb-2 max-md:text-sm max-sm:text-xs">
              New Password
            </label>
            <motion.input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-3 bg-gray-700 border-0 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 max-md:p-2 max-md:text-sm max-sm:p-2 max-sm:text-xs"
              type="password"
              placeholder="Enter new password (optional)"
              whileFocus="focus"
              variants={inputVariants}
            />
          </div>

          <div className="mb-6 max-md:mb-4 max-sm:mb-3">
            <label className="block text-gray-300 mb-2 max-md:text-sm max-sm:text-xs">
              Gender
            </label>
            <div className="flex gap-4 max-md:gap-2 max-sm:gap-2">
              <label className="flex items-center text-gray-300 max-md:text-sm max-sm:text-xs">
                <input
                  type="radio"
                  value="male"
                  checked={user.gender === "male"}
                  onChange={handleGenderChange}
                  className="radio radio-primary max-md:radio-sm max-sm:radio-xs"
                  required
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="flex items-center text-gray-300 max-md:text-sm max-sm:text-xs">
                <input
                  type="radio"
                  value="female"
                  checked={user.gender === "female"}
                  onChange={handleGenderChange}
                  className="radio radio-primary max-md:radio-sm max-sm:radio-xs"
                  required
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-400 max-md:py-2 max-md:text-sm max-sm:py-2 max-sm:text-xs"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Updating..." : "Update Profile"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfileModal;
