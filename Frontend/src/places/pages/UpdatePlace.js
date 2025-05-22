import React ,{useEffect, useState, useContext} from "react";
import { useParams, useHistory } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import "./Placeform.css";

const UpdatePlace = () => {
    const auth = useContext(AuthContext); // useContext is used to get the value of AuthContext
    const history = useHistory(); // useHistory is used to navigate to different routes
    const { isLoading, error, sendRequest, clearError } = useHttpClient(); // useHttpClient is used to make API calls
    const placeId = useParams().placeId;    // Get the placeId from the URL
    const [place, setPlace] = useState(); // State to store the place data 
    const baseUrl = process.env.REACT_APP_BACKEND_URL; 
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },        
        true
    );  // Call the useForm custom hook with initial values

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await sendRequest('get', baseUrl+`api/places/${placeId}`); // Fetch the place data from the API
                setPlace(response.place); // Set the place data in the state
                const loadedPlace = response.place; 
                setFormData({
                title: {
                    value: loadedPlace.title,
                    isValid: true
                },    
                description: {
                    value: loadedPlace.description,
                    isValid: true
                }            
            }, true);
            }catch(err) {
                console.log(err);
            }
        };
        fetchPlaces();
    },[sendRequest, placeId, setFormData,]); // Fetch the place data when the component mounts or when placeId changes

    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        const placeData = {
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
        };
        try {
            await sendRequest('patch', baseUrl+`api/places/${placeId}`, placeData); 
            // Send the updated place data to the API
            history.push(`/${auth.userId}/places`); // Navigate to the user's places page after updating
        }catch(err) {
            console.log(err);
        }                   
    }

    if (!place && !error) {
        return (
            <div className="center">
                <Card>
                    <h2 >Could not find place with id: {placeId}</h2>
                </Card>
            </div>
        );
    }   // If the place is not found then return this message
    
    return (
    <>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && place && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} 
            errorText={"Please type valid title"}  onInput={inputHandler} 
            initialValue={place.title} valid={true}/>
            <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText={"Please type valid description (at least 5 characters)"}  onInput={inputHandler} 
            initialValue={place.description} valid={true}/>
            <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>}
    </>
    
    );
}

export default UpdatePlace;