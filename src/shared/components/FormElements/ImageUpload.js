import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'
import './ImageUpload.css'

const ImageUpload = ({id, center, onInput, errorText, style}) => {
    const [file, setFile] = useState()
    const [isValid, setIsValid] = useState(false)
    const [imagePreview, setImagePreview] = useState()
    const imagePickerRef = useRef()

    const pickedHandler = () => {
        imagePickerRef.current.click() // This will trigger the click event on the hidden file input
    }

    useEffect(() => {
        if (!file) {
            return
        }
        const fileReader = new FileReader() // Create a new FileReader object
        fileReader.onload = () => {
            setImagePreview(fileReader.result) // fileReader.result contains the base64 encoded image data   
        }
        fileReader.readAsDataURL(file) 
    },[file])

    const handleUpload = (event) => {
        let pickedFile;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            onInput(id, pickedFile, true) // Call the onInput function with the file
            setIsValid(true)
        }
        else {
            setIsValid(false)
            onInput(id, null, false) 
        }
    }

    return (
        <div className={`form-control ${center && 'center'}`}>
            <div className="image-upload">
                <div className="image-upload__preview" style={style}>
                    {isValid && <img src={imagePreview} alt="Preview" />}
                    {!isValid && <p>Please pick an image.</p>}
                </div>
                <Button type="label" onClick={pickedHandler} >Upload Image
                    <input
                        id={id}
                        ref={imagePickerRef}
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                    />
                </Button>
            </div>
            {!isValid && <p className="error-text">{errorText}</p>}
            
        </div>
    )
}

export default ImageUpload;