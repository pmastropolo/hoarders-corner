import React, { useEffect, useRef, useState } from "react";
import Button from "../Atoms/Button";

const FileUpload = ({ file, onFileChange }) => {

  const inputRef = useRef();

  const [imageUrl, setImageUrl] = useState("");

  const handleSelectImage = () => {
    if (!file) {
      inputRef.current.click();
    } else if (file) {
      onFileChange();
    }
  };

  const handleChangeImage = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (!file) {
      return;
    } 
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImageUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="flex flex-col gap-1">
      {file && imageUrl && <img
        src={imageUrl}
        alt="Upload Image"
        className="h-auto w-auto"
      />}
      <input 
        type="file" 
        ref={inputRef} 
        onChange={handleChangeImage}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
      />
      <Button
        label={file ? "Remove File" : "Select File"}
        action={handleSelectImage}
        style={file ? "danger" : ""}
      />
    </div>
  );
};

export default FileUpload;
