import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Msg = ({ message }) => {
  const scroll = useRef();
  const { authUser, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isSender = authUser?._id === message?.senderId;
  const timestamp = message?.createdAt
    ? format(new Date(message.createdAt), "HH:mm")
    : "";

  return (
    <motion.div
      className={`chat ${
        isSender ? "chat-end" : "chat-start"
      } mb-3 max-md:mb-2 max-sm:mb-2`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      ref={scroll}
    >
      <div className="chat-image avatar ">
        <div className="w-8 rounded-full max-md:w-6">
          <img
            alt="profile"
            src={isSender ? authUser?.profilePhoto : selectedUser?.profilePhoto}
          />
        </div>
      </div>

      <div className="chat-header text-xs text-gray-400 max-md:text-[10px] max-sm:text-[10px]">
        <time>{timestamp}</time>
      </div>
      
      <div
        className={`chat-bubble ${
          isSender ? "bg-green-700 text-white" : "bg-violet-600 text-gray-200"
        } rounded-lg max-md:text-sm max-md:p-2 max-sm:text-sm max-sm:p-2 max-w-[70%]`}
      >
        {message?.message}
      </div>
    </motion.div>
  );
};

export default Msg;
