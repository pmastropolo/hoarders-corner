// THIS GOES INTO A FOLDER NAMED FileUpload

// IMPORT REACT AND HOOKS
import React, { useEffect, useRef, useState } from "react";

// IMPORT BUTTON COMPONENT
import Button from "../Atoms/Button";

// FILE UPLOAD COMPONENT
const FileUpload = ({ file, onFileChange }) => {

  // USE REF FOR INPUT ELEMENT
  const inputRef = useRef();

  // STATE FOR IMAGE URL
  const [imageUrl, setImageUrl] = useState("");

  // HANDLE SELECT IMAGE BUTTON CLICK
  const handleSelectImage = () => {
    if (!file) {
      inputRef.current.click(); // TRIGGER FILE INPUT
    } else if (file) {
      onFileChange(); // HANDLE FILE CHANGE
    }
  };

  // HANDLE FILE INPUT CHANGE
  const handleChangeImage = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]); // UPDATE FILE
    }
  };

  // EFFECT TO READ FILE AND SET IMAGE URL
  useEffect(() => {
    if (!file) {
      return; // EXIT IF NO FILE
    } 
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImageUrl(fileReader.result); // SET IMAGE URL ON LOAD
    };
    fileReader.readAsDataURL(file); // READ FILE
  }, [file]);

  // RENDER FILE UPLOAD COMPONENT
  return (
    <div className="flex flex-col gap-1">
      {/* RENDER IMAGE IF AVAILABLE */}
      {file && imageUrl && <img
        src={imageUrl}
        alt="Upload Image"
        className="h-auto w-auto"
      />}
      {/* HIDDEN FILE INPUT */}
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChangeImage}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
      />
      {/* BUTTON TO TRIGGER FILE INPUT OR REMOVE FILE */}
      <Button
        label={file ? "Remove File" : "Select File"}
        action={handleSelectImage}
        style={file ? "danger" : ""}
      />
    </div>
  );
};

// EXPORT COMPONENT
export default FileUpload;
