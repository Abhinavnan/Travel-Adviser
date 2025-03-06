import React from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
    {
        id: "p1",
        title: "Empire State Building",
        description: "One of the most famous sky scrapers in the world!",
        imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg",
        address: "20 W 34th St, New York, NY 10118",
        location: {
        lat: 40.7484405,
        lng: -73.9878531
        },
        creator: "u1"
    },
    {
        id: "p2",
        title: "Eiffel Tower",
        description: "A wrought-iron lattice tower on the Champ de Mars in Paris, France.",
        imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
        address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
        location: {
        lat: 48.8583701,
        lng: 2.2922926
        },
        creator: "u2"
    } 
];    // Dummy data

const UserPlaces = () => {
    const userId = useParams().userId;  // Get the userId from the URL
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId); // Filter the places by creator
    return (<PlaceList items={loadedPlaces} />);
};

export default UserPlaces;