import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack} from "react-bootstrap";
import avatar from "../../assets/avatar.svg"

const UserChat = ({chat, user}) => {

    const {recipientUser} = useFetchRecipientUser(chat, user);

    
    return ( 
        <Stack 
            direction="horizontal" 
            gap={3} 
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
        >
            <div className="d-flex">
                <div className="me-2">
                    <img src={avatar} height="35px"/>
                </div>
                <div className="text-content">
                    <div className="name">{recipientUser?.name}</div>
                    <div className="text">TextMessage</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    24/10/3434
                </div>
                <div className="this-user-notifications">2</div>
                <span className="user-online"></span>
            </div>
        </Stack>
    );
};
 
export default UserChat;