import React, { useEffect } from "react";
import SendMessage from "./SendMessage";
import Messages from "./Messages";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBack, IoChatbubblesOutline } from "react-icons/io5";
import { setSelectedUser } from "../redux/userSlice";

const MessageContainer = ({ setIsChatOpen }) => {
  const { selectedUser, authUser, onlineUsers } = useSelector(
    (store) => store.user
  );
  const dispatch = useDispatch();
  const isOnline = onlineUsers?.includes(selectedUser?._id);

  const handleBackClick = () => {
    dispatch(setSelectedUser(null));
    setIsChatOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-800 max-sm:w-full min-h-screen box-sizing-border-box">
      {selectedUser ? (
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center gap-3 p-4 bg-gray-700 max-md:p-3 max-sm:p-3 max-sm:gap-2">

            <button
              className="btn btn-sm btn-circle bg-gray-600 text-white max-sm:flex max-md:hidden"
              onClick={handleBackClick}
            >
              <IoArrowBack size={20} className="max-md:size-5 max-sm:size-5" />
            </button>

            <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
              <div className="w-10 rounded-full max-md:w-8 max-sm:w-8 border-2 border-gray-500">
                <img src={selectedUser?.profilePhoto} alt="profile" />
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <p className="text-white font-semibold max-md:text-sm max-sm:text-sm">
                {selectedUser?.fullName}
              </p>
              <p className="text-xs text-gray-200 max-md:text-[10px] max-sm:text-[10px]">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          <Messages />

          <SendMessage />

        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="bg-gray-700 rounded-xl p-6 shadow-lg max-w-md w-full text-center border border-gray-600 max-md:p-4 max-sm:p-3">
            
            <IoChatbubblesOutline
              size={60}
              className="text-blue-600 mx-auto mb-4 max-md:size-48 max-sm:size-36"
            />

            <h1 className="text-2xl font-semibold text-gray-100 mb-2 max-md:text-xl max-sm:text-lg">
              Start a Conversation
            </h1>

            <p className="text-base text-gray-300 max-md:text-sm max-sm:text-xs">
              Select a contact from the sidebar to begin chatting.
            </p>

            <p className="text-sm text-gray-400 mt-2 max-md:text-xs max-sm:text-[10px]">
              {authUser?.fullName
                ? `Welcome, ${authUser.fullName}!`
                : "Welcome to the chat!"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;