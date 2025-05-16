import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import { Toaster } from "react-hot-toast";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setOnlineUsers } from "./redux/userSlice";
import { SOCKET_URL } from "./config";
import { setSocketId } from "./redux/socketSlice";

const ProtectedRoute = ({ children }) => {
  const { authUser } = useSelector((store) => store.user);
  return authUser ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (authUser) {
      const newSocket = io(SOCKET_URL, {
        query: {
          userId: authUser._id,
        },
        withCredentials: true,
        transports: ["websocket", "polling"],
      });
      setSocket(newSocket);
      dispatch(setSocketId(newSocket));

      newSocket.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
        dispatch(setSocketId(null));
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
      dispatch(setSocketId(null));
    }
  }, [authUser, dispatch]);

  return (
    <div className="min-h-screen">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#1E293B",
            color: "#E2E8F0",
            borderRadius: "18px 18px 0px 18px",
            padding: "9px",
            transform: "translateX(0)",
            animation: "slideIn 0.3s ease-in-out",
          },
          success: {
            style: { background: "green", color: "white" },
          },
          error: {
            style: { background: "red", color: "white" },
          },
        }}
      />
    </div>
  );
}

export default App;
