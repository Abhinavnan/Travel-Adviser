import React,{useContext} from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal"; 
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./Placeform.css";

const NewPlace = () => {
  const auth = useContext(AuthContext); // useContext is used to get the value of AuthContext
  const { isLoading, error, sendRequest, clearError  } = useHttpClient(); // useHttpClient is used to make API calls
  const history = useHistory(); // useHistory is used to navigate to different routes
  const baseUrl = process.env.REACT_APP_BACKEND_URL; 
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false
      },
      description: {
        value: "",
        isValid: false
      },
      address: {
        value: "",
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      }
    },
    false
  ); // Call the useForm custom hook
  const placeSubmitHandler =async event => {
    event.preventDefault();
    if(!formState.isValid){
      return; // If formState is not valid then return, to prevent form submission while clicking ImageUpload button
    }
    const formData = new FormData(); // Create a new FormData object
    formData.append('title', formState.inputs.title.value); // Append the title field to the FormData object
    formData.append('description', formState.inputs.description.value); 
    formData.append('address', formState.inputs.address.value); 
    formData.append('image', formState.inputs.image.value); // Append the image field to the FormData object
    formData.append('creator', auth.userId); 
    try {
      await sendRequest('post', baseUrl+'api/places', formData);
      history.push(`/${auth.userId}/places`); // Navigate to home page after adding place
    }catch(err) {
      console.log(err);
    }
  }
  
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="place-form" onSubmit={placeSubmitHandler}>
        <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} 
        errorText={"Please type valid title"}  onInput={inputHandler}/>
        {/* VALIDATOR_REQUIRE function is properties of validation */}
        <ImageUpload id="image" center onInput={inputHandler} style={{width: '20rem'}} />
        {/* ImageUpload is a custom component */}
        <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} 
        errorText={"Please type valid description"}  onInput={inputHandler}/>
        {/* VALIDATOR_MINLENGTH function is properties of validation */}
        <Input id="address" element="input" label="Address" validators={[VALIDATOR_REQUIRE()]}
        errorText={"Please type valid address"}  onInput={inputHandler}/>
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
        {/* If formState is not valid then disable the button */}
      </form>
    </>
  );
};

export default NewPlace;