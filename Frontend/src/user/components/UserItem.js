import React from "react";
import { Link } from "react-router-dom"; //For the link to the user places
import "./UserItem.css";
import Card from "../../shared/components/UIElements/Card";
import Avather from "../../shared/components/UIElements/Avatar";
const UserItem = ({id, name, image, placesCount}) => {
    const baseUrl = process.env.REACT_APP_BACKEND_URL;; // Base URL for the API
    //const imageUrl = baseUrl + image;  // for local image
    const imageUrl = image // for S3 bucket
    return (
        <li className="user-item">
            <Card className="user-item__content">
                <Link to={`/${id}/places`}> {/* Add this link to the UserPlaces page*/}
                    <div className="user-item__image">
                        <Avather image={imageUrl} alt={name} />
                    </div>
                    <div className="user-item__info">
                        <h2>{name}</h2>
                        <h3>{placesCount} {placesCount === 1 ? 'Place' : 'Places'}</h3>
                    </div>
                </Link>
            </Card>                                  
        </li>
    );
}   

export default UserItem;