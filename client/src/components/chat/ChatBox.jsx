import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/chatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";

const ChatBox = () => {
    const {user} = useContext(AuthContext)
    const {currentChat, messages, isMessagesLoading} = useContext(ChatContext)
    const {recipientUser} = useFetchRecipientUser(currentChat, user)
    console.log("Updating current chat:", currentChat);

    
    if(!recipientUser){ 
    return(
        <p style={{textAlign: "center", width: "100"}}>
            
            No convo selected yet
        </p>
    );}

    if(!isMessagesLoading){ 
        return(
            <p style={{textAlign: "center", width: "100"}}>
                Loading Chat      
            </p>
        );}

    return <>ChatBox</>;
}
 
export default ChatBox;