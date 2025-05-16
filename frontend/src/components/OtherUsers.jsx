import Users from "./Users";
import useGetOtherUsers from "../hooks/useGetOtherUsers";
import { useSelector } from "react-redux";

const OtherUsers = ({ setIsChatOpen, isDrawer }) => {
  useGetOtherUsers();
  const { otherUsers } = useSelector((store) => store.user);

  if (!otherUsers) return null;

  return (
    <div className="overflow-y-auto flex-1">
      {Array.isArray(otherUsers) &&
        otherUsers.map((user) => (
          <Users
            key={user._id}
            user={user}
            setIsChatOpen={setIsChatOpen}
            isDrawer={isDrawer}
          />
        ))}
    </div>
  );
};

export default OtherUsers;
