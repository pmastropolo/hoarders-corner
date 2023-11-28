import Modal from "../Modals/Modal"; // IMPORT MODAL COMPONENT
import Input from "../Atoms/Input"; // IMPORT INPUT COMPONENT
import TextArea from "../Atoms/TextArea"; // IMPORT TEXTAREA COMPONENT
import Checkbox from "../Atoms/Checkbox"; // IMPORT CHECKBOX COMPONENT
import { useState } from "react"; // IMPORT USESTATE HOOK FROM REACT
import { useMutation } from "@apollo/client"; // IMPORT USEMUTATION HOOK FROM APOLLO CLIENT
import { ADD_ITEM } from "../../utils/mutations"; // IMPORT ADD_ITEM MUTATION
import Auth from "../../utils/auth"; // IMPORT AUTH UTILS
import { QUERY_COMMUNITY_ITEMS, QUERY_MY_HOARD, QUERY_MY_COMMUNITIES } from "../../utils/queries"; // IMPORT QUERIES

// IMPORT FILE UPLOAD COMPONENT
import FileUpload from "../FileUpload";

// IMPORT AWS SDK FOR S3
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// AWS Configuration  
const bucketName = "our-group-project-last-one-three";                   // BUCKET NAME FOR AWS S3
const accessKeyId = "AKIA3KMU7OYO4F4E7GDM";                              // AWS ACCESS KEY ID
const secretAccessKey = "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";      // AWS SECRET ACCESS KEY
const region = 'us-east-1';                                              // AWS REGION

// INITIALIZE S3 CLIENT
const client = new S3Client({ 
  credentials: { 
    accessKeyId,         // SET ACCESS KEY ID
    secretAccessKey      // SET SECRET ACCESS KEY
  },
  region                 // SET REGION
});

// CREATE ITEM FORM COMPONENT
export default function CreateItemForm({
  communityName, // PROPS: COMMUNITY NAME
  closeModal, // PROPS: FUNCTION TO CLOSE MODAL
  communityId, // PROPS: COMMUNITY ID
}) {
  // STATE AND MUTATION FOR CREATING ITEM
  const [createItem, { error, data }] = useMutation(ADD_ITEM, {
    refetchQueries: [
      // REFETCH QUERIES AFTER MUTATION
      {
        query: QUERY_COMMUNITY_ITEMS, // QUERY TO REFETCH COMMUNITY ITEMS
        variables: { communityId: communityId }, // PASS COMMUNITY ID AS VARIABLE
      },
      {
        query: QUERY_MY_HOARD, // QUERY TO REFETCH USER'S HOARD
        variables: { communityId: communityId }, // PASS COMMUNITY ID AS VARIABLE
      },
      // {
        // query: QUERY_MY_COMMUNITIES // UNCOMMENT TO REFETCH COMMUNITIES
      // }
    ],
  });
  const [isPublic, setIsPublic] = useState(false); // STATE FOR ITEM VISIBILITY
  const [formState, setFormState] = useState({
    name: "", // FORM STATE FOR ITEM NAME
    description: "", // FORM STATE FOR ITEM DESCRIPTION
    isPublic: isPublic, // FORM STATE FOR ITEM VISIBILITY
  });
}

const [file, setFile] = useState(); // STATE FOR FILE UPLOAD

const handleFormChange = (event) => { // FUNCTION TO HANDLE FORM CHANGES
  const { name, value } = event.target; // DESTRUCTURING NAME AND VALUE FROM EVENT TARGET

  setFormState({ // UPDATE FORM STATE
    ...formState, // PRESERVE PREVIOUS STATE VALUES
    [name]: value, // UPDATE SPECIFIC FIELD BASED ON NAME
  });
};

const handleIsPublic = () => { // FUNCTION TO TOGGLE PUBLIC STATE
  setIsPublic(!isPublic); // TOGGLE ISPUBLIC STATE
  setFormState({ ...formState, isPublic: !isPublic }); // UPDATE FORM STATE WITH NEW ISPUBLIC VALUE
};

  const createNewItem = async () => {
    event.preventDefault();
    let imageLink = "";
    try {
      if (file) {
        console.log('File Exists');
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: file?.name,
          Body: file,
          ContentType: file.type
        });
        await client.send(command);
        const itemCommand = new GetObjectCommand({ Bucket: bucketName, Key: file?.name });
        imageLink = await getSignedUrl(client, itemCommand);
      }
      const { data } = await createItem({
        variables: {
          name: formState.name,
          description: formState.description,
          isPublic: formState.isPublic,
          owner: Auth.getProfile().authenticatedPerson.username,
          community: communityName,
          communityId: communityId,
          imageUrl: imageLink,
        },
      });
    } catch (error) {
      console.error(error);
    }
    closeModal();
  };

return (
  <>
    <Modal
      closeModal={closeModal} // SET FUNCTION TO CLOSE MODAL
      heading={
        <>
          Create new {<span className="text-pri-5">{communityName}</span>} Item // MODAL HEADING WITH COMMUNITY NAME
        </>
      }
      btnLabel={"Create Item"} // SET LABEL FOR MODAL BUTTON
      btnAction={createNewItem} // SET FUNCTION FOR BUTTON ACTION
      body={
        <>
          <Input
            label="Item Name" // INPUT FOR ITEM NAME
            warning={true} // ENABLE WARNING STATE
            name={"name"} // SET NAME PROPERTY
            value={formState.name} // BIND INPUT VALUE TO FORM STATE
            change={handleFormChange} // SET FUNCTION TO HANDLE CHANGE
          />
          <TextArea
            label={`Item Description`} // TEXTAREA FOR ITEM DESCRIPTION
            name={"description"} // SET NAME PROPERTY
            value={formState.description} // BIND TEXTAREA VALUE TO FORM STATE
            onChange={handleFormChange} // SET FUNCTION TO HANDLE CHANGE
          />
          <Checkbox
            label="This item is public." // CHECKBOX FOR PUBLIC ITEM OPTION
            onChange={handleIsPublic} // SET FUNCTION TO HANDLE CHECKBOX CHANGE
            checked={isPublic} // BIND CHECKBOX STATE
            name={"isPublic"} // SET NAME PROPERTY
          />
          <FileUpload file={file} onFileChange={setFile} /> // COMPONENT FOR FILE UPLOAD
        </>
      }
    />
  </>
);
}
