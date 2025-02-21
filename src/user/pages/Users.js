import React from "react";
import UserList from "../components/UserList";
const Users = () => {
    const USERS = [{id: 'u1', name: 'Max Schwarz', 
        image: 'https://images.pexels.com/photos/13471546/pexels-photo-13471546.jpeg?auto=compress&cs=tinysrgb&w=200&h=750&dpr=1',
        places: 3
        }];
    return (
        <UserList items={USERS} />
    );
}

export default Users;