import React,{ useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import './PlaceItem.css';

const PlaceItem = ({id, image, title, description, address, creatorId, coordinates, onDelete}) => { 
    const baseUrl = process.env.REACT_APP_BACKEND_URL;  
    const [showMap, setShowMap] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const auth = useContext(AuthContext);   // useContext is used to get the value of AuthContext
    const { isLoading, error, sendRequest, clearError  } = useHttpClient(); // useHttpClient is used to make API calls
    const showDeleteHandlerWaring = () => {
        setShowConfirmModal(true);
    }
    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    }
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest('delete', baseUrl+`api/places/${id}`,);
            onDelete(id); // Call the onDelete function passed from parent component
        }catch(err) {
            console.log(err);
        }
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
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
                        <img src={baseUrl+image} alt={title} /> 
                    </div>
                    <div className="place-item__info">
                        <h2>{title}</h2>
                        <h3>{address}</h3>
                        <p>{description}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={()=>setShowMap(true)}>View on Map</Button> {/*goto modal component while clicking */}
                        {auth.userId === creatorId && <Button to={`/places/${id}`}>Edit</Button>}
                        {auth.userId === creatorId && <Button danger onClick={showDeleteHandlerWaring}>Delete</Button>}
                    </div>
                </Card>
            </li>
        </React.Fragment>
    ); 
}

export default PlaceItem;