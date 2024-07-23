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
    if (!user) return;

    const socketInstance = io(`wss://uniconn-chat-app-repo.onrender.com`, {
      query: { userId: user._id },
    });

    socketInstance.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

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

        const chat = chats.find(
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

  const selectedChat = chats.find(
    (chat) => chat.participants[0]._id === mentorId
  );
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
        />
      ))
    );
  }, [chats, dispatch, loadingChats]);

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
                        className={`chat ${
                          msg.senderId === user._id ? "chat-end" : "chat-start"
                        }`}
                      >
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt="Avatar"
                              src={
                                msg.senderId === user._id
                                  ? user.profilePic
                                  : selectedChat?.participants[0]?.profilePic ||
                                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                              }
                            />
                          </div>
                        </div>
                        <div className="chat-bubble">{msg.message}</div>
                      </div>
                    ))
                  ) : (
                    <p>No messages in this conversation.</p>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-300">
                  <form className="flex" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      className="flex-grow border text-sm rounded-lg p-2.5 bg-gray-700 border-gray-600 text-white"
                      placeholder="Send a message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="ml-4 text-white bg-blue-500 hover:bg-blue-700 rounded-lg px-4 py-2"
                    >
                      {sendMessageLoading ? (
                        <div className="loading loading-spinner"></div>
                      ) : (
                        "Send"
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="w-full p-4 text-center">
                Select a mentor to start chatting
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="w-full text-center p-4">
          Please log in to view your chats.
        </div>
      )}
    </div>
  );
};

export default Chat;
