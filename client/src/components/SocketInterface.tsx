import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

interface Message {
  id: number;
  text: string;
  media: string | null;
  username: string;
  timestamp: string;
  clientMessageId: string;
  type: "message" | "system";
}

interface User {
  username: string;
  online: boolean;
}

const SocketInterface: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUser, setTypingUser] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  // Establish socket connection
  useEffect(() => {
    // const newSocket = io("http://localhost:3000") 
    const newSocket = io("https://chat-app-backend-5es5.onrender.com")
    setSocket(newSocket);

    newSocket.on("connect", () => {
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch username and userId from backend and chat history
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // const response = await axios.get("http://localhost:3000/api/v1/user/getuser", {
        //   withCredentials: true,
        // });
        const response = await axios.get("https://chat-app-backend-5es5.onrender.com/api/v1/user/getuser", {
          withCredentials: true,
        });
        // console.log("User Data fetched: " + response.data.data);

        // alert("Logged In as: " + response.data.data.username);
        const user = response.data.data;
        console.log("Username: " + user.username);
        console.log("User ID: " + user._id);
        setUsername(user.username);
        setUserId(user._id);

        if (socket) {
          socket.emit("user:join", {
            userId: user._id,
            username: user.username,
          });
        }

        // const chatHistoryResponse = await axios.get(
        //   "http://localhost:3000/api/v1/chat/history",
        //   { withCredentials: true }
        // );
        const chatHistoryResponse = await axios.get(
          "https://chat-app-backend-5es5.onrender.com/api/v1/chat/history",
          { withCredentials: true }
        );
        const processedMessages = chatHistoryResponse.data.data.map((msg: any) => ({
          id: msg._id,
          text: msg.message,
          username: msg.username,
          timestamp: msg.timestamp,
          type: "message",
          media: msg.media || null, // Handle missing media
        }));

        setMessages(processedMessages);
      } catch (error) {
        alert("User Not Found: " + " Please Login to Chat");
        navigate("/");
      }
    };

    fetchUsername();
  }, [socket, navigate]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("started sending process")
    if (!message.trim() && !mediaFile) return;
    // console.log("Sender: ", userId);
    // console.log("Username: ", username)
    // console.log("Message", message)
    const formData = {
      senderId: userId,
      username: username,
      message: message,
      mediaFile: mediaFile ? mediaFile : null,
    };

    // console.log("Sender ID:", userId);
    const clientMessageId = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // console.log("Sending message to backend:", formData);
      // const response = await axios.post("http://localhost:3000/api/v1/chat/send", formData, { withCredentials:true});
      const response = await axios.post("https://chat-app-backend-5es5.onrender.com/api/v1/chat/send", formData, { withCredentials: true });

      socket?.emit("message:send", {
        ...response.data.data,
        clientMessageId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setMessage("");
      setMediaFile(null);
    }
  };


  // Listen for incoming events
  useEffect(() => {
    if (!socket) return;

    socket.on("message:receive", (savedMessage) => {
      console.log("Message Received", savedMessage);
      setMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg.clientMessageId === savedMessage.clientMessageId);
        if (exists) return prevMessages;

        return [
          ...prevMessages,
          {
            id: savedMessage._id,
            text: savedMessage.message,
            username: savedMessage.username, // Access username here
            timestamp: savedMessage.timestamp,
            type: "message",
            media: savedMessage.media || null,
            clientMessageId: savedMessage.clientMessageId,
          }
        ];
      });
    });


    socket.on("user:online", (usersList: User[]) => {
      setUsers(usersList);
    });

    return () => {
      socket.off("message:receive");
      socket.off("user:online");
      socket.off("typing:started");
      socket.off("typing:stopped");
    };
  }, [socket]);



  const handleTyping = () => {
    if (!socket) return;

    // Emit typing event to backend with the username
    socket.emit("typing:started", { username });

    // Set timeout to stop typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stopped");
    }, 3000);
  };

  // Listen for typing events from others
  useEffect(() => {
    if (!socket) return;

    socket.on("typing:started", (data) => {
      // Set the typing user only if it's not the current user typing
      if (data.username !== username) {
        setTypingUser(data.username); // Show that someone else is typing
      }
    });

    socket.on("typing:stopped", () => {
      setTypingUser(""); // Hide typing status
    });

    return () => {
      socket.off("typing:started");
      socket.off("typing:stopped");
    };
  }, [socket, username]);


  const handleLogout = async () => {
    socket?.emit("logout", userId);

    try {
      // Send GET request to logout route with the credentials (cookies)
      const response = await axios.get("https://chat-app-backend-5es5.onrender.com/api/v1/user/logout", { withCredentials: true });
      // const response = await axios.get("http://localhost:3000/api/v1/user/logout", { withCredentials: true });

      // Optionally handle the response if needed
      if (response.status === 200) {
        // Redirect to the login page after successful logout
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };




  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Chat Room</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="flex h-[calc(100vh-6rem)]">
          <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Online Users ({users.length})</h2>
            </div>
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${user.online ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-gray-700">{user.username}</span>
                  {user.username === username && (
                    <span className="text-xs text-indigo-600 font-medium">(You)</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 ${msg.type === "system" ? "text-center" : msg.username === username ? "text-right" : ""}`}
                  >
                    <div
                      className={`inline-block p-4 rounded-lg shadow ${msg.type === "system"
                        ? "bg-gray-200 text-gray-600"
                        : msg.username === username
                          ? "bg-indigo-500 text-white"
                          : "bg-white border border-gray-200"
                        }`}
                    >
                      {msg.type !== "system" && (
                        <div className="font-semibold text-sm mb-1">{msg.username}</div>
                      )}
                      <div className="text-sm">{msg.text}</div>
                      {msg.media && (
                        <div className="mt-2">
                          {msg.media.endsWith(".mp4") || msg.media.endsWith(".webm") ? (
                            <video src={msg.media} controls className="max-w-full rounded" />
                          ) : (
                            <img src={msg.media} alt="media" className="max-w-full rounded" />
                          )}
                        </div>
                      )}
                      <div className="text-xs opacity-75 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {typingUser && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-gray-500 italic"
                >
                  {typingUser} is typing...
                </motion.div>
              )}

              <div ref={messageEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 flex gap-2 items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={() => handleTyping()}
                placeholder="Type a message..."
                className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />

              <button type="submit" className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors duration-200">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );

};

export default SocketInterface;
