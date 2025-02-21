import React from "react";
import { useReducer, useCallback } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) { // If there is no inputId then continue
          continue; 
        }
        if (inputId === action.inputId) { 
          formIsValid = formIsValid && action.isValid;  // if inputId is updating then check the validity
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid; // if inputId is not updating then pass previous value
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {value: action.value, isValid: action.isValid} // dynamically update the inputId and value
        },
        isValid: formIsValid
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
      });
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({type: "INPUT_CHANGE", value: value, isValid: isValid, inputId: id});    
      }, []);
    // useCallback is used to prevent the function from being recreated on every render cycle

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
          type: "SET_DATA",
          inputs: inputData,
          formIsValid: formValidity
        });
      }, []);
    
    return [formState, inputHandler, setFormData];
}; //custom hook always starts with small letter