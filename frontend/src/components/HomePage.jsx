import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    if (selectedUser) {
      setIsChatOpen(true);
    } else {
      setIsChatOpen(false);
    }
  }, [selectedUser]);

  return (
    <motion.div
      className="flex min-h-screen w-full bg-gray-800 text-gray-100 overflow-x-hidden relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`max-md:w-[300px] max-sm:${
          isChatOpen ? "hidden" : "w-full"
        }`}
      >
        <Sidebar setIsChatOpen={setIsChatOpen} />
      </div>

      <motion.div
        className={`flex-1 max-sm:${isChatOpen ? "block" : "hidden"}`}
        initial={{ x: "100%" }}
        animate={{ x: isChatOpen ? 0 : selectedUser ? "100%" : 0 }}
        transition={{ duration: 0.3 }}
      >
        <MessageContainer setIsChatOpen={setIsChatOpen} />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
