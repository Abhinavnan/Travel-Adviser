import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
    const userId = useParams().userId;  // Get the userId from the URL
    const [places, setPlaces] = useState([]); // State to store the places of the user
    const { isLoading, error, sendRequest, clearError  } = useHttpClient(); // useHttpClient is used to make API calls
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await sendRequest('get', baseUrl+`api/places/user/${userId}`); // Fetch the places of the user                
                setPlaces(response.places); // Set the places in the state
            } catch (err) {
                console.log(err);
            }
        };
        fetchPlaces();
    },[sendRequest, userId]); // Fetch the places when the component mounts or when userId changes

    const placeDeletedHandler = (deletedPlaceId) => {
        setPlaces((prevPlaces) => prevPlaces.filter((place) => place.id !== deletedPlaceId)); // Filter out the deleted place from the state
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <PlaceList items={places} onDelete={placeDeletedHandler} />
        </>
    );
};

export default UserPlaces;