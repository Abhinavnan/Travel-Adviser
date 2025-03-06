import React from "react";
import UserList from "../components/UserList";
const Users = () => {
    const USERS = [{id: 'u1', name: 'Max Schwarz', 
        image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200&h=750&dpr=1&crop=top',
        places: 3
        },
        {id: 'u2', name: 'Manuel Lorenz',
        image: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2&crop=top',
        places: 5}];
    return (
        <UserList items={USERS} />
    );
}

export default Users;