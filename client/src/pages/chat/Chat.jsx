import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import LeftChat from "../../components/LeftChat";
import { setMentorId, clearMentorId } from "../../redux/chatSlice";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { mentorId } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const leftChatRef = useRef(null);
  const chatListRef = useRef(null);

  const fetchChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const response = await fetch(
        `${process.env.VITE_BACKEND_URL}/api/v1/user/chat`,
        { credentials: "include" }
      );
      const data = await response.json();
      console.log(data);
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchChats();
  }, [user, fetchChats]);

  useEffect(() => {
    if (user) {
      const socketInstance = io(`${process.env.VITE_BACKEND_URL}`, {
        path: "/socket",
        transports: ["websocket", "polling"],
        secure: true,
        query: { userId: user._id },
      });
      setSocket(socketInstance);
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
      return;
    } else {
      console.log("no user and no socket");
      return;
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        scrollToBottom();
      });

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.off("newMessage");
        socket.off("getOnlineUsers");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (!mentorId) {
      dispatch(clearMentorId());
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await fetch(
          `${process.env.VITE_BACKEND_URL}/api/v1/messages/get/${mentorId}`,
          { credentials: "include" }
        );
        const data = await response.json();
        setMessages(data);

        const chat = chats?.find(
          (chat) => chat.participants[0]._id === mentorId
        );
        if (!chat) {
          const userInfoResponse = await fetch(
            `${process.env.VITE_BACKEND_URL}/api/v1/user/${mentorId}`,
            { credentials: "include" }
          );
          const userInfo = await userInfoResponse.json();
          const newChat = {
            _id: mentorId,
            participants: [userInfo.data],
            lastMessage: data[data.length - 1] || {},
          };
          setChats((prev) => [
            ...prev.filter((c) => c._id !== mentorId),
            newChat,
          ]);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [mentorId, chats, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    setSendMessageLoading(true);

    try {
      const response = await fetch(
        `${process.env.VITE_BACKEND_URL}/api/v1/messages/send/${mentorId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: message }),
        }
      );
      const data = await response.json();
      setMessages((prev) => [...prev, data]);
      setMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setSendMessageLoading(false);
    }
  };

  const handleBackClick = () => {
    dispatch(clearMentorId());
    if (window.innerWidth <= 768) {
      chatListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectedChat = Array.isArray(chats)
    ? chats.find((chat) => chat.participants[0]._id === mentorId)
    : null;

  const mentorProfilePic =
    selectedChat?.participants[0]?.profilePic ||
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const mentorName = selectedChat?.participants[0]?.name || "Loading...";

  const renderChats = useCallback(() => {
    return loadingChats ? (
      <div className="p-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-2 mb-2 bg-gray-200 animate-pulse rounded-md"
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      chats.map((chat) => (
        <LeftChat
          key={chat._id}
          lastMessage={chat.lastMessage?.message || ""}
          name={chat.participants[0]?.name || "Loading..."}
          pic={
            chat.participants[0]?.profilePic ||
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
          }
          onClick={() => {
            dispatch(setMentorId(chat.participants[0]._id));
            if (window.innerWidth <= 768) {
              leftChatRef.current?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          isOnline={onlineUsers.includes(chat.participants[0]._id)}
        />
      ))
    );
  }, [chats, dispatch, loadingChats, onlineUsers]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {user ? (
        <>
          <div
            ref={chatListRef}
            className={`w-full md:w-1/3 bg-gray-100 ${
              mentorId ? "hidden md:block" : ""
            }`}
          >
            {renderChats()}
          </div>
          <div
            ref={leftChatRef}
            className={`w-full md:w-2/3 ${mentorId ? "" : "hidden"}`}
          >
            {mentorId ? (
              <>
                <div className="flex items-center p-4 bg-gray-200 border-b border-gray-300">
                  <button
                    className="mr-4 text-blue-500 md:hidden"
                    onClick={handleBackClick}
                  >
                    Back
                  </button>
                  <img
                    className="w-10 h-10 rounded-full mr-4"
                    src={mentorProfilePic}
                    alt="Profile"
                  />
                  <h2 className="text-lg font-semibold">{mentorName}</h2>
                </div>
                <div className="flex flex-col gap-3 p-4 overflow-y-auto h-[calc(100vh-150px)] no-scrollbar">
                  {loadingMessages ? (
                    <div className="p-4">
                      {[...Array(6)].map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-2 mb-2 bg-gray-200 animate-pulse rounded-md"
                        >
                          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`p-2 rounded-md ${
                          msg.sender === user._id
                            ? "bg-blue-500 text-white self-end"
                            : "bg-gray-200 self-start"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">
                      No messages yet.
                    </div>
                  )}
                  <div ref={messagesEndRef}></div>
                </div>
                <div className="p-4 bg-gray-200">
                  <form className="flex gap-2" onSubmit={handleSendMessage}>
                    <input
                      className="flex-1 p-2 border rounded-md"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message"
                      disabled={sendMessageLoading}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-500 rounded-md"
                      disabled={sendMessageLoading}
                    >
                      {sendMessageLoading ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full text-center text-gray-500">
          You need to be logged in to see your chats
        </div>
      )}
    </div>
  );
};

export default Chat;
