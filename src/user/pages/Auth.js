import React, { useState, useContext } from "react";
import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import "./Auth.css";

const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const auth = useContext(AuthContext);   // useContext is used to get the value of AuthContext
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: "",
                isValid: false
            },
            password: {
                value: "",
                isValid: false
            }
        },
        false
    );
    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
        auth.login(); // Call the login function from auth-context.js
    }
    const switchModeHandler = () => {
        if (!isLoginMode) { 
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid && formState.inputs.password.isValid
                // validate Signup form if email and password is valid then switch to login
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: "",
                        isValid: false
                    }
                    // input name field in formState
                },
                false
            );     
            }
        setIsLoginMode(prevMode => !prevMode);
        // If previous mode is login then switch to signup
        // If previous mode is signup then switch to login
        // prevMode is used get the previous mode
    }
    return (
        <Card className="authentication">
            <h2 className="">Login Required</h2>
            <hr/> {/*Horizontal line*/}
            { !isLoginMode && <Input element="input" id="name" type="text" label="Name" validators={[VALIDATOR_REQUIRE()]}
            errorText={"Please type valid name"} onInput={inputHandler}/> }
            {/* If isLoginMode is false then show the name input field */}
            {/* inputHandler function send the input value to formState for validation */}
            <form className="authentication__header" onSubmit={authSubmitHandler}>               
                <Input id="email" element="input" type="email" label="Email" validators={[VALIDATOR_EMAIL()]} 
                errorText={"Please type valid email"}  onInput={inputHandler}/>
                {/* VALIDATOR_EMAIL function validate email input */}
                <Input id="password" element="input" type="password" label="Password" validators={[VALIDATOR_MINLENGTH(5)]}
                errorText={"Please type valid password with minimum 5 characters"}  onInput={inputHandler}/>
                {/* VALIDATOR_MINLENGTH function validate password input have at least 5 characters */}
                <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? "LOGIN" : "SIGNUP"}</Button>
                {/* Disable the button if formState is not valid */}
            </form>
            <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}</Button>
            {/* If isLoginMode is true then switch to signup else switch to login */}
        </Card>
    );
};

export default Auth;