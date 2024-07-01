import React from "react";
import { useEffect, useState } from "react";

const Chat = () => {
  const [selectedconversation, setSelectedConversation] = useState("");
  const [showconversations, setShowConversations] = useState([]);
  return (
    <div className="flex flex-row">
      <div className="lg:w-[30%] md:w-[40%] h-[100vh] bg-fuchsia-500 flex flex-col"></div>
      <div className=""></div>
    </div>
  );
};

export default Chat;
