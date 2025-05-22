import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = ({ className, style, headerClass, header, onSubmit, contentClass, children, footerClass, footer }) => {
    const content = (
        <div className={`modal ${className}`} style={style}>
        <header className={`modal__header ${headerClass}`}>
            <h2>{header}</h2>
        </header>
        <form onSubmit={onSubmit || (event => event.preventDefault())}>
            <div className={`modal__content ${contentClass}`}>{children}</div>
            <footer className={`modal__footer ${footerClass}`}>{footer}</footer>
        </form>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById("modal-hook")); 
    // ReactDOM.createPortal() allows us to render content outside of the regular DOM hierarchy.

};

const Modal = ({ show, onCancel, header, footer, onSubmit, contentClass, footerClass, children }) => {
    return (
        <React.Fragment>
            {show && <Backdrop onClick={onCancel} />}
            <CSSTransition in={show} timeout={200} classNames="modal" mountOnEnter unmountOnExit>
                <ModalOverlay header={header} onSubmit={onSubmit} footer={footer} contentClass={contentClass} footerClass={footerClass}>
                    {children}
                </ModalOverlay> 
            </CSSTransition>
        </React.Fragment>
    ); 
    // Model is a reusable component that can be used to display a modal with a header, content, and footer.
    // ModalOverlay is a component that will render the modal content and is responsible for rendering the modal content.
};

export default Modal;