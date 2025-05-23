import React from "react";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import "./UsersList.css";
const UserList = ({items}) => {
    if (items.length === 0) {
        return (
            <div className="center">
                <Card>
                <h2>No users found.</h2>
                </Card>
            </div>
        );
    }
    return (
        <ul className="users-list">
            {items.map(user => (
                <UserItem key={user.id} id={user.id} name={user.name} image={user.image} placesCount={user.places.length} />
            ))}
        </ul>
    );  
}

export default UserList;