import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LeftChat from "../../components/LeftChat";
import { io } from "socket.io-client";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendMessageLoading, setsendMessageLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUser] = useState([]);
  const isOnline = onlineUsers.includes(selectedConversation);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(
          "https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app/user/chat",
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("response", data);
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const socket = io(
        "https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app",
        {
          query: { userId: user._id },
        }
      );
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });

      return () => {
        socket.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [messages, socket, setMessages]);

  const handleConversation = async (receiverid) => {
    console.log("Fetching messages for chat:", receiverid);
    try {
      const response = await fetch(
        `https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app/messages/get/${receiverid}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("Messages fetched:", data);
      setMessages(data);
      setSelectedConversation(receiverid);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    setsendMessageLoading(true);
    try {
      const res = await fetch(
        `https://uniconn-chat-app-repo-dw8d5g67b-kalkeshwars-projects.vercel.app/messages/send/${selectedConversation}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ text: message }),
        }
      );
      const data = await res.json();

      setMessages([...messages, data]);
    } catch (error) {
      // toast.error(error.message);
      console.log(error.message);
    } finally {
      setsendMessageLoading(false);
    }
    setMessage("");
  };

  return (
    <div>
      {user ? (
        <div className="flex flex-row">
          <div className="lg:w-[30%] md:w-[40%] h-[100vh] flex flex-col relative bg-gray-100">
            {chats.map((chat) => (
              <LeftChat
                key={chat._id}
                lastMessage={chat.lastMessage.message}
                name={chat.participants[0].name}
                onClick={() => handleConversation(chat.participants[0]._id)}
                isOnline={isOnline}
              />
            ))}
            <div className="absolute top-0 right-0 bg-gray-300 w-1 h-full"></div>
          </div>
          {selectedConversation ? (
            <div className="flex flex-col justify-between w-[70%] ">
              <div className="flex flex-col gap-3 p-4 w-[100%]">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`chat ${
                        message.senderId === user._id
                          ? "chat-end"
                          : "chat-start"
                      }`}
                    >
                      <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                          <img
                            alt="Avatar"
                            src={
                              message.sender === user._id
                                ? user.avatar
                                : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                            }
                          />
                        </div>
                      </div>
                      <div className="chat-bubble">{message.message}</div>
                    </div>
                  ))
                ) : (
                  <p>No messages in this conversation.</p>
                )}
              </div>
              <div>
                <form className="px-4 my-3" onSubmit={handleSendMessage}>
                  <div className="w-full relative">
                    <input
                      type="text"
                      className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
                      placeholder="Send a message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 end-0 flex items-center pe-3  text-white"
                    >
                      {sendMessageLoading ? (
                        <div className="loading loading-spinner"></div>
                      ) : (
                        <p>Send</p>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <p>Select a conversation to see the chats.</p>
          )}
        </div>
      ) : (
        <p onClick={() => navigate("/login")}>
          Please login to see your chats.
        </p>
      )}
    </div>
  );
};

export default Chat;
