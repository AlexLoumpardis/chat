import { createContext, useState, useEffect, useCallback } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";


export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) =>{
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);

    console.log("messages", messages);

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
        const getUserChats = async() => {
            if(user?._id){

                setIsUserChatsLoading(true)
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`)

                setIsUserChatsLoading(false)

                if(response.error){
                    return setUserChatsError(response)
                }

                setUserChats(response)
            }
        }
        getUserChats();
    }, [user])


    useEffect(() => {
      const getMessages = async() => {

              setIsMessagesLoading(true)
              setMessagesError(null);

              const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`)

              setIsMessagesLoading(false)

              if(response.error){
                  return setMessagesError(response)
              }

              setMessages(response)
      }
      getMessages();
  }, [currentChat])

    const updateCurrentChat = useCallback((chat)=>{
      console.log("Updating current chat:", chat);
      setCurrentChat(chat)
    }, [])


    const createChat = useCallback(async(firstId, secondId) =>{
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify({
          firstId, 
          secondId,
      }));
    

    if(response.error){
        return console.log("error creating chat", response)
    }
        setUserChats((prev) =>[...prev, response]);
    }, [])

    return <ChatContext.Provider value = {{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
    }}
    >
        {children}
    </ChatContext.Provider>
}