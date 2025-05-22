import React from 'react';
import ReactDOM from 'react-dom';
import './Backdrop.css';

const Backdrop = props => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById('backdrop-hook')
  );
}; // createPortal is used to render the JSX elements outside the root div element in index.html
  // backdrop-hook is the id of the div element in index.html
  // onClick is used to close the backdrop

export default Backdrop;
