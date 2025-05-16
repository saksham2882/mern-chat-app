import { useState, useRef } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import OtherUsers from "./OtherUsers";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setOtherUsers } from "../redux/userSlice";
import { motion } from "framer-motion";
import ProfileModal from "./ProfileModal";
import { API_BASE_URL } from '../config';

const Sidebar = ({ setIsChatOpen }) => {
  const [search, setSearch] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/logout`);
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/`, {
        withCredentials: true,
      });
      dispatch(setOtherUsers(res.data.otherUsers));
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const searchSubmitHandler = async (e) => {
    e.preventDefault();
    if (search.trim() === "") {
      await fetchAllUsers();
      return;
    }

    try {
      await fetchAllUsers();
      const latestUsers = (
        await axios.get(`${API_BASE_URL}/api/v1/user/`, {
          withCredentials: true,
        })
      ).data.otherUsers;

      const matchingUsers = latestUsers.filter((user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase())
      );

      if (matchingUsers.length > 0) {
        dispatch(setOtherUsers(matchingUsers));
      } else {
        toast.error("No users found");
      }
    } catch (error) {
      toast.error("Search failed");
    }
  };

  const clearSearchHandler = () => {
    setSearch("");
    fetchAllUsers();
  };

  const handleEditProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsDrawerOpen(false);
  };

  const handleConfirmLogout = () => {
    logoutHandler();
    setIsLogoutModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const handleChatOpen = (value) => {
    setIsChatOpen(value);
    setIsDrawerOpen(false);
  };

  return (
    <motion.div
      className="border-r border-gray-700 flex flex-col bg-gray-900 h-screen overflow-y-auto w-full md:w-[300px]"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between p-4 bg-gray-800 max-md:p-3 max-sm:p-3">

        <div className="flex items-center gap-3 max-sm:gap-2">
          <div className="avatar">
            <div className="w-10 rounded-full max-md:w-8 max-sm:w-8 border-2 border-gray-500">
              <img src={authUser?.profilePhoto} alt="Profile" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-white max-md:text-lg max-sm:text-base">
            <span className="text-lg max-md:text-base max-sm:text-sm truncate max-w-[150px] md:max-w-[180px] inline-block">
              {authUser?.fullName} Chats
            </span>
          </h1>
        </div>

        <button
          className="btn btn-ghost btn-circle max-md:btn-sm max-sm:btn-sm"
          onClick={() => setIsDrawerOpen(true)}
        >
          <BsThreeDotsVertical
            size={20}
            className="text-white max-md:size-5 max-sm:size-5"
          />
        </button>
      </div>

      <form
        onSubmit={searchSubmitHandler}
        className="flex items-center gap-2 p-4 max-md:p-3 max-sm:p-3 max-sm:bg-gray-800"
      >
        <div className="relative w-full">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered rounded-full bg-gray-700 text-gray-100 w-full max-md:text-sm max-sm:text-sm pr-10"
            type="text"
            placeholder="Search chats..."
          />
          {search && (
            <button
              type="button"
              onClick={clearSearchHandler}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-100 cursor-pointer"
            >
              <IoClose size={20} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-circle bg-gray-700 text-white max-md:btn-sm max-sm:btn-sm max-sm:hidden"
        >
          <BiSearchAlt size={20} className="max-md:size-5 max-sm:size-5" />
        </button>
      </form>


      <OtherUsers setIsChatOpen={handleChatOpen} isDrawer={false} />
      {isDrawerOpen && (
        <motion.div
          className="fixed top-0 right-0 h-full bg-gray-900 p-4 z-30 overflow-hidden md:w-[300px] max-md:w-1/2 max-sm:w-3/4"
          style={{ left: "auto" }}
          initial={{ x: "100%" }}
          animate={{ x: isDrawerOpen ? 0 : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="btn btn-sm btn-circle bg-gray-700 text-white mb-4"
            onClick={() => setIsDrawerOpen(false)}
          >
            ✕
          </button>

          <ul className="menu p-2 bg-gray-800 rounded-box w-full border border-gray-600 max-md:text-sm max-sm:text-sm">
            <li>
              <button
                onClick={handleEditProfileClick}
                className="text-gray-100 hover:bg-gray-700"
              >
                Edit Profile
              </button>
            </li>

            <li>
              <button
                onClick={handleLogoutClick}
                className="text-gray-100 hover:bg-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>

        </motion.div>
      )}


      {isDrawerOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDrawerOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}


      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} />
      )}


      {isLogoutModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 border border-gray-600 max-md:w-64 max-sm:w-[90%]"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-100 mb-4 max-md:text-base max-sm:text-sm">
              Confirm Logout
            </h2>

            <p className="text-gray-300 mb-6 max-md:text-sm max-sm:text-xs">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-4 max-md:gap-2 max-sm:gap-1">
              <button
                onClick={handleCancelLogout}
                className="btn btn-sm bg-gray-600 text-gray-100 hover:bg-gray-700 max-md:btn-xs max-sm:btn-xs max-sm:text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="btn btn-sm bg-gray-700 text-white hover:bg-gray-800 max-md:btn-xs max-sm:btn-xs max-sm:text-xs"
              >
                Confirm
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
