import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,  // condition
    userId: null, // default value
    token: null, 
    onLogout: () => {}, // default value
    onLogin: () => {}
}); // create a context with default value of isLoggedIn as false
    // context is used to pass the data to the components without using props
    // cannot export default as it is not a component



