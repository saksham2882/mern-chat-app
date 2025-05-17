import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { API_BASE_URL } from '../config';

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedUser?._id) {
      dispatch(setMessages([]));
      return;
    }

    const fetchMessages = async () => {
      try {
        dispatch(setMessages([]));

        const url = `${API_BASE_URL}/api/v1/message/${selectedUser._id}`;
        const res = await axios.get(url, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        dispatch(setMessages(res.data.data || []));
      } 
      catch (error) {
        dispatch(setMessages([]));
      }
    };

    fetchMessages();
  }, [selectedUser?._id, dispatch]);
};

export default useGetMessages;
