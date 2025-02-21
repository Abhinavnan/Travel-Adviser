import React from "react";
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./Placeform.css";

const NewPlace = () => {
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
      }
    },
    false
  ); // Call the useForm custom hook
  const placeSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs); // Log the formState inputs
  }

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} 
      errorText={"Please type valid title"}  onInput={inputHandler}/>
      {/* VALIDATOR_REQUIRE function is properties of validation */}
      <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} 
      errorText={"Please type valid description"}  onInput={inputHandler}/>
      {/* VALIDATOR_MINLENGTH function is properties of validation */}
      <Input id="address" element="input" label="Address" validators={[VALIDATOR_REQUIRE()]}
      errorText={"Please type valid address"}  onInput={inputHandler}/>
      <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
      {/* If formState is not valid then disable the button */}
    </form>
  );
};

export default NewPlace;