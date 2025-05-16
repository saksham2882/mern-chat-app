import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector((store) => store.socket);
  const { selectedUser, authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket || !selectedUser?._id) return;

    socket.on("newMessage", (newMessage) => {
      if (
        (newMessage.senderId === selectedUser._id &&
          newMessage.receiverId === authUser._id) ||
        (newMessage.senderId === authUser._id &&
          newMessage.receiverId === selectedUser._id)
      ) {
        dispatch(addMessage(newMessage));
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectedUser?._id, authUser?._id, dispatch]);
};

export default useGetRealTimeMessage;
