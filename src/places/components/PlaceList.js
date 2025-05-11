import React from "react";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import './PlaceList.css';
const PlaceList = ({items, onDelete}) => {
    if (items.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>No places found. Maybe create one?</h2>
                    <Button to="/places/new">Share Place</Button> {/* Redirect to new place page */}
                </Card>
            </div>
        );
    }
    return (
        <ul className="place-list">
            {items.map(place => (
                <PlaceItem key={place.id} id={place.id} image={place.image} title={place.title} onDelete={onDelete}
                description={place.description} address={place.address} creatorId={place.creator} coordinates={place.location} />
            ))}
        </ul>
    );
}


export default PlaceList;