import { createContext, useState, useEffect, useCallback } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null)
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null)
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null)

  console.log("online users", onlineUsers)

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect()
    }
  }, [user]);

  //add online users
  useEffect(() => {
    if (socket === null) return
    socket.emit("addNewUser", user?._id)
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res)
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket])

  //send message
  useEffect(() => {
    if (socket === null) return

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId })

  }, [newMessage])


  //receive
  useEffect(() => {
    if (socket === null) return

    socket.on("getMessage", res => {
      if (currentChat?._id !== res.chatId) return

      setMessages((prev) => [...prev, res])
    })

    return () => {
      socket.off("getMessage")
    }

  }, [socket, currentChat])



  useEffect(() => {
    const getUsers = async () => {
      // Check if the user object exists and has an _id property
      if (!user || !user._id) {
        return; // Exit early if user or user._id is null or undefined
      }

      const response = await getRequest(`${baseUrl}/users`);
      if (response.error) {
        return console.log("error fetching users", response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        // Check if the user object exists and has an _id property
        if (!user || !user._id) {
          return false; // Skip this user if user or user._id is null or undefined
        }

        if (user._id === u._id) return false;

        if (userChats) {
          userChats.forEach((chat) => {
            const isChatBetweenUsers =
              chat.members.includes(u._id) && chat.members.includes(user._id);
            if (isChatBetweenUsers) {
              isChatCreated = true;
              console.log(`Chat exists between ${u.name} and ${user.name}: ${isChatCreated}`);
              return; // Exit the loop early if a chat is found
            }
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
    };

    getUsers(); // Call the function to fetch users
  }, [userChats, user?._id]); // Include user?._id in the dependency array


  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {

        setIsUserChatsLoading(true)
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`)

        setIsUserChatsLoading(false)

        if (response.error) {
          return setUserChatsError(response)
        }

        setUserChats(response)
      }
    }
    getUserChats();
  }, [user])


  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      try {
        const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);

        setIsMessagesLoading(false);

        if (response.error) {
          return setMessagesError(response);
        }

        setMessages(response);

        // Log the updated messages state
        console.log("Updated messages state:", response);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsMessagesLoading(false);
        setMessagesError(error);
      }
    };

    getMessages();
  }, [currentChat]);


  const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) return console.log("Type something")

    const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
      chatId: currentChatId,
      senderId: sender._id,
      text: textMessage
    }))

    if (response.error) {
      return sendTextMessageError(response);
    }

    setNewMessage(response)
    setMessages((prev) => [...prev, response])
    setTextMessage("")

  }, [])

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat)
  }, [])


  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
      firstId,
      secondId,
    }));


    if (response.error) {
      return console.log("error creating chat", response)
    }
    setUserChats((prev) => [...prev, response]);
  }, [])

  return <ChatContext.Provider value={{
    userChats,
    isUserChatsLoading,
    userChatsError,
    potentialChats,
    createChat,
    updateCurrentChat,
    messages,
    isMessagesLoading,
    messagesError,
    currentChat,
    sendTextMessage,
    onlineUsers,
  }}
  >
    {children}
  </ChatContext.Provider>
}