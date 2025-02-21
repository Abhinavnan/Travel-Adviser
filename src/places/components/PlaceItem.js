import React from "react";
import { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import './PlaceItem.css';

const PlaceItem = ({id, image, title, description, address, creatorId, coordinates}) => {   
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const showDeleteHandlerWaring = () => {
        setShowConfirmModal(true);
    }
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    }
    const confirmDeleteHandler = () => {
        console.log("DELETING...");
        setShowConfirmModal(false);
    }

    return (
        <React.Fragment>
            <Modal show={showMap} onCancel={() => setShowMap(false)} header={address} 
            contentClass="place-item__modal-content" footerClass="place-item__modal-actions" 
            footer={<Button onClick={() => setShowMap(false)}>CLOSE</Button>}>
                <div className="map-container">
                    <Map center={coordinates} zoom={16} />
                </div>
            </Modal>
            <Modal show={showConfirmModal} onCancel={cancelDeleteHandler} header="Are you sure?"    
            footerClass="place-item__modal-actions" footer={
                <React.Fragment>
                    <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
                    <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
                </React.Fragment>
            }>
                <p>Do you want to proceed and delete this place? Please note that it can't be undone thereafter.</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    <div className="place-item__image">
                        <img src={image} alt={title} /> 
                    </div>
                    <div className="place-item__info">
                        <h2>{title}</h2>
                        <h3>{address}</h3>
                        <p>{description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={()=>setShowMap(true)}>View on Map</Button> {/*goto modal component while clicking */}
                        <Button to={`/places/${id}`}>Edit</Button>
                        <Button danger onClick={showDeleteHandlerWaring}>Delete</Button>
                    </div>
                </Card>
            </li>
        </React.Fragment>
    ); 
}

export default PlaceItem;