import React ,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import "./Placeform.css";

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

const UpdatePlace = () => {
    const [isLoading, setIsLoading] = useState(true);
    const placeId = useParams().placeId;    // Get the placeId from the URL

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
    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs); // Log the formState inputs
    }

    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId); // Find the place by placeId if it exists

    useEffect(() => {
        if (identifiedPlace) {
            setFormData({
                title: {
                    value: identifiedPlace.title,
                    isValid: true
                },    
                description: {
                    value: identifiedPlace.description,
                    isValid: true
                }            
            }, true);   // Set the form data with the identified place data            
        }   // If the place is found then set the form data        
        setIsLoading(false);    // Set the form data and loading state to false
        }, [identifiedPlace, setFormData]); // useEffect hook to set the form data
    // useEffect hook is used to run the function only once when the component is rendered else it will run infinitely

    if (!identifiedPlace) {
        return (
            <div className="center">
                <Card>
                    <h2 >Could not find place with id: {placeId}</h2>
                </Card>
            </div>
        );
    }   // If the place is not found then return this message

    if (isLoading) {
        return (
            <div className="center">
                <h2 >Loading...</h2>
            </div>
        );
    }   // If the title is not found then return this message
        // This is to prevent the form from rendering before the title is loaded
    
    return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} 
        errorText={"Please type valid title"}  onInput={inputHandler} 
        initialValue={formState.inputs.title.value} valid={formState.inputs.title.isValid}/>
        <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText={"Please type valid description (at least 5 characters)"}  onInput={inputHandler} 
        initialValue={formState.inputs.description.value} valid={formState.inputs.description.isValid}/>
        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
    </form>
    
    );
}

export default UpdatePlace;