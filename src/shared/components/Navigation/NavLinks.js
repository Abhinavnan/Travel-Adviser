import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = () => {
    const auth = useContext(AuthContext); // useContext is used to get the value of AuthContext
    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/users" exact>ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn && <li>
                <NavLink to={`${auth.userId}/places`}>MY PLACES</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to="/places/new">ADD PLACE</NavLink>
            </li>}
            {!auth.isLoggedIn && <li>
                <NavLink to="/auth">AUTHENTICATE</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <button onClick={auth.logout}>LOGOUT</button>
            </li>} {/* Call the logout function from auth-context.js */}
        </ul>
    );
};

export default NavLinks;