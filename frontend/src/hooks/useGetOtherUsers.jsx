import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from "../redux/userSlice";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from '../config';

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/user`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        dispatch(setOtherUsers(res.data.otherUsers));
      } 
      catch (err) {
        toast.error("Error fetching other users");
      }
    };

    fetchOtherUsers();
  }, [dispatch]);
};

export default useGetOtherUsers;