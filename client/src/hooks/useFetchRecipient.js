import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {

    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        const fetchRecipientUser = async () => {
            if (!recipientId) {
                return;
            }

            try {
                const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
                setRecipientUser(response);
            } catch (error) {
                setError(error);
            }
        };

        fetchRecipientUser();

    }, [recipientId]);

    return { recipientUser };
};
