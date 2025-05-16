import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

const Users = ({ user, setIsChatOpen, isDrawer }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers } = useSelector((store) => store.user);
  const isOnline = onlineUsers?.includes(user._id);

  const selectedUserHandler = (user) => {
    dispatch(setSelectedUser(user));
    setIsChatOpen(true);
  };

  return (
    <>
      <div
        onClick={() => selectedUserHandler(user)}
        className={`${
          selectedUser?._id === user._id ? "bg-gray-700" : ""
        } flex gap-3 p-3 items-center cursor-pointer hover:bg-gray-700 max-md:gap-2 max-sm:gap-2 max-sm:p-2 ${
          isDrawer ? "justify-center" : ""
        }`}
      >
        <div className={`${isOnline ? "avatar avatar-online" : "avatar"} max-md:mx-2`}>
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-500">
            <img
              src={user?.profilePhoto}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {!isDrawer && (
          <div className="flex flex-col flex-1 max-sm:flex max-sm:flex-col">
            <div className="flex justify-between gap-2">
              <p className="text-gray-100 font-semibold max-md:text-sm max-sm:text-sm">
                {user?.fullName}
              </p>
            </div>
            <p className="text-gray-400 text-sm max-md:text-xs max-sm:text-xs truncate">
              {user?.username || "No messages yet"}
            </p>
          </div>
        )}

      </div>

      <div className="divider my-0 py-0 h-px bg-gray-700"></div>
    </>
  );
};

export default Users;
