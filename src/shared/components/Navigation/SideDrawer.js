import React from "react";
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.css';


const SideDrawer = ({children, show, onClick}) => {
    const content = ( <CSSTransition in={show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
    {/* For animation of opening and closing of SideDrawer */}
    <aside className="side-drawer" onClick={onClick}> {children} </aside> 
    {/* onClick is for closing the drawer while clicking any option */}
    </CSSTransition>
    );
    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
    // ReactDOM.createPortal() allows us to render content outside of the regular DOM hierarchy.
}       

export default SideDrawer;