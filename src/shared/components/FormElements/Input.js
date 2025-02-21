import React, {useReducer, useEffect} from "react";
import {validate} from "../../util/validators"; // Import validate function from validators.js
import "./Input.css";

const inputReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators) // Validate the input field
            };
        case "TOUCH":
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
}; // Validate the input field

const Input = ({id, type, placeholder, rows, element, label, errorText, validators, onInput, initialValue, valid} ) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: initialValue || "",
        isValid: valid || false,
        isTouched: false
    }); // useReducer is used to manage state
    const {isValid, value} = inputState; // Destructure the inputState
    useEffect(() => {
        onInput(id, value, isValid); // Call the onInput function
    }, [id, value, isValid, onInput] ); // Call the onInput function
    // useEffect is used to run the function when the component is rendered

    const touchHandler = () => {
        dispatch({type: "TOUCH"} ); // Dispatch the action
    };  // Dispatch the action
    const changeHandler = event => {
        dispatch({type: "CHANGE", val: event.target.value, validators: validators}); // Dispatch the action
    };  // Dispatch the action
    const Element = element === "input" ? (
        <input id={id} type={type} placeholder={placeholder} onChange={changeHandler} value={inputState.value} onBlur={touchHandler} />
    ) : (
        <textarea id={id} rows={rows || 3} onChange={changeHandler} value={inputState.value} onBlur={touchHandler} />    
        // onBlur make sure that the input field is at least one time touched
        // If element is textarea then rows will be 3 else given rows
    );  // Accept either input or textarea
    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && "form-control--invalid"}`}> 
            {/* If inputState is not valid then add form-control--invalid class */}
            <label htmlFor={id}>{label}</label> {/* htmlFor is using as for loop */}
            {Element}   {/* Dynamically add labels */}
            {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>} {/* If inputState is not valid then show error */}
        </div>  
    );
};

export default Input;