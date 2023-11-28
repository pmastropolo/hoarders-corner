import { useState } from "react"; // IMPORT USESTATE HOOK FROM REACT
import Button from "../Atoms/Button"; // IMPORT BUTTON COMPONENT

export default function Modal({
  heading, // PROP: MODAL HEADING
  body, // PROP: MODAL BODY CONTENT
  btnLabel, // PROP: BUTTON LABEL
  btnAction, // PROP: FUNCTION FOR BUTTON ACTION
  closeModal, // PROP: FUNCTION TO CLOSE MODAL
}) {
  const handleCloseClick = () => { // FUNCTION TO HANDLE CLOSE BUTTON CLICK
    closeModal(); // CALL CLOSE MODAL FUNCTION
  };

  return (
    <div className="w-screen h-screen bg-[#00000080] absolute top-0 left-0 flex items-center"> // MODAL OVERLAY STYLING
      <div className="w-[640px] bg-neu-0 p-8 mx-auto rounded-lg flex flex-col gap-6"> // MODAL BOX STYLING
        <div className="flex items-center "> // CONTAINER FOR HEADER
          <h2 className="text-h2 font-bold w-full">{heading}</h2> // MODAL HEADING
          <i
            className="fa-solid fa-close text-h2 w-6 h-6 items-center flex text-center cursor-pointer hover:text-pri-7"
            onClick={handleCloseClick} // CLOSE BUTTON WITH STYLING AND CLICK HANDLER
          ></i>
        </div>
        {body} // MODAL BODY CONTENT
        <Button label={btnLabel} action={btnAction} /> // BUTTON WITH LABEL AND ACTION
      </div>
    </div>
  );
}
