import { useContext } from "react";
import { ChatContext } from "../context/chatContext";
import ChatBox from "../components/chat/ChatBox";
import { Container, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat, currentChat, messages } = useContext(ChatContext);

    return (
        // <ChatContext.Provider value={{ userChats, isUserChatsLoading, updateCurrentChat, currentChat, messages}}>
        <Container>
            <PotentialChats />
            {userChats?.length < 1 ? null : (
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading Chats</p>}
                        {userChats?.map((chat, index) => {
                            return (
                                <div key={index} onClick={() => updateCurrentChat(chat)}>
                                    <UserChat chat={chat} user={user} />
                                </div>
                            )
                        })}
                    </Stack>
                    <ChatBox />
                </Stack>
            )}
        </Container>
        // </ChatContext.Provider>
    );
}

export default Chat;
