import { useState } from "react"; // IMPORT USESTATE HOOK FROM REACT
import Button from "../Atoms/Button"; // IMPORT BUTTON COMPONENT
import Input from "../Atoms/Input"; // IMPORT INPUT COMPONENT

// When implementing the prop "body" it needs to be an input element to
// to able to use a useState on our search
// can reference the call of modal in AllCommunities page

export default function SearchBar({
  btnAction, // PROP: FUNCTION TO EXECUTE ON BUTTON CLICK
  bType, // PROP: BUTTON TYPE
  searchFieldLabel, // PROP: LABEL FOR SEARCH FIELD
  change, // PROP: FUNCTION TO HANDLE INPUT CHANGE
  value, // PROP: VALUE OF THE INPUT FIELD
}) {
  return (
    <div className="flex mb-4 "> 
      <div className="mr-2"> 
        <Input
          label={searchFieldLabel} 
          change={change} 
          type={"text"} 
          value={value} 
        />
      </div>
      <Button label="Search" action={btnAction} type={bType} /> 
    </div>
  );
}
