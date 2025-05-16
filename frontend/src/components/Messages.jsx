import Msg from "./Msg";
import useGetMessages from "../hooks/useGetMessages";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { IoChatbubblesOutline } from "react-icons/io5";

const Messages = () => {
  useGetMessages();
  useGetRealTimeMessage();
  const { messages } = useSelector((store) => store.message);
  if (!messages) return null;

  const groupedMessages = messages.reduce((acc, message) => {
    const date = format(new Date(message.createdAt), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});

  return (
    <div className="px-4 flex-1 max-h-[calc(100vh-144px-20px)] overflow-y-auto pb-[80px] md:ml-[10px] max-sm:ml-0 max-sm:flex max-sm:justify-center max-md:px-3 max-sm:px-3">
      <div className="w-full max-sm:max-w-3xl">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-16">
            <IoChatbubblesOutline
              size={60}
              className="text-green-700 mb-4 max-md:size-30 max-sm:size-20"
            />

            <p className="text-lg max-md:text-base max-sm:text-sm">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              <div className="text-center my-4 max-md:my-2 max-sm:my-2">
                <span className="bg-gray-600 text-gray-200 px-3 py-1 rounded-full text-xs max-md:text-[10px] max-sm:text-[10px]">
                  {format(new Date(date), "MMMM d, yyyy")}
                </span>
              </div>

              {groupedMessages[date].map((message) => (
                <Msg key={message._id} message={message} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
