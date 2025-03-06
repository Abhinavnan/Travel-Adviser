import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css";

const MainNavigation = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    return (
        <React.Fragment> {/* This is a built-in React component that allows us to wrap more than one adjacent JSX elements */}
            {drawerIsOpen && <Backdrop onClick={() => setDrawerIsOpen(false)} />} {/* for closing the drawer */}
            <SideDrawer show={drawerIsOpen} onClick={() => setDrawerIsOpen(false)}> {/* for mobile devices */}
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav> {/* NavLinks is used to navigate to different pages */}
            </SideDrawer>
            <MainHeader>
                <button className="main-navigation__menu-btn" onClick={() => setDrawerIsOpen(true)}>
                    <span />
                    <span />
                    <span />
                </button>
                <h1 className="main-navigation__title">
                    <Link to="/">YourPlaces</Link> {/* Goto to the home page while clicking the title YourPlaces  */}
                </h1>
                <nav className="main-navigation__header-nav">
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
} // We can add custom styling to NavLinks by adding className to the NavLinks component

export default MainNavigation;