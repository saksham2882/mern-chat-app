import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoSend } from "react-icons/io5";
import { motion } from "framer-motion";
import axios from "axios";
import { addMessage } from "../redux/messageSlice";
import { API_BASE_URL } from '../config';

const SendMessage = () => {
  const [message, setMessage] = useState("");
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/message/send/${selectedUser._id}`,
        { message },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      dispatch(addMessage(res.data.newMessage));
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="p-4 bg-gray-900 fixed bottom-0 left-[300px] right-0 z-10 max-md:left-[300px] max-sm:left-0 max-sm:w-full flex items-center gap-2 max-md:p-3 max-md:gap-1 max-sm:p-3 max-sm:gap-1"
    >
      <motion.input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-3 bg-gray-700 border-0 rounded-full text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 max-md:p-2 max-md:text-sm max-sm:p-2 max-sm:text-sm max-sm:mx-2"
        type="text"
        placeholder="Type a message..."
        whileFocus="focus"
      />
      <motion.button
        type="submit"
        className="btn btn-circle bg-green-600 text-white hover:bg-green-700 max-md:btn-sm max-sm:btn-sm max-sm:mr-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!message.trim() || !selectedUser}
      >
        <IoSend size={20} className="max-md:size-5 max-sm:size-5" />
      </motion.button>
    </form>
  );
};

export default SendMessage;
