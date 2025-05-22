import React,{useEffect, useState} from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UserList from "../components/UserList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
const Users = () => {
    const { isLoading, error, sendRequest, clearError  } = useHttpClient(); // useHttpClient is used to make API calls
    const [USERS, setUsers] = useState([]);
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await sendRequest('get', baseUrl+'api/users');                 
                setUsers(response.users);
            } catch (err) {
                console.log(err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <UserList items={USERS} />
        </>
    );
}

export default Users;