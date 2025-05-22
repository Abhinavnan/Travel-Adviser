import React from "react";
import './MainHeader.css';

const MainHeader = ({children}) => {
    return (
        <header className="main-header">
            {children} {/* This is a special prop that React provides to us. It will render the content that we pass between 
                        the opening and closing tags of our component. */}
        </header>
    );
}

export default MainHeader;