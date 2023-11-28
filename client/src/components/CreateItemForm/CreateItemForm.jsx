import Modal from "../Modals/Modal";
import Input from "../Atoms/Input";
import TextArea from "../Atoms/TextArea";
import Checkbox from "../Atoms/Checkbox";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_ITEM } from "../../utils/mutations";
import Auth from "../../utils/auth";
import { QUERY_COMMUNITY_ITEMS, QUERY_MY_HOARD, QUERY_MY_COMMUNITIES } from "../../utils/queries";
import FileUpload from "../FileUpload";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// AWS Configuration  
const bucketName = "our-group-project-last-one-three";
const accessKeyId = "AKIA3KMU7OYO4F4E7GDM";
const secretAccessKey = "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";
const region = 'us-east-1';


const client = new S3Client({ 
  credentials: { 
    accessKeyId, 
    secretAccessKey
  },
  region
})


export default function CreateItemForm({
  communityName,
  closeModal,
  communityId,
}) {
  const [createItem, { error, data }] = useMutation(ADD_ITEM, {
    refetchQueries: [
      {
        query: QUERY_COMMUNITY_ITEMS,
        variables: {
          communityId: communityId,
        },
      },
      {
        query: QUERY_MY_HOARD,
        variables: {
          communityId: communityId,
        },
      },
      // {
        // query: QUERY_MY_COMMUNITIES
      // }
    ],
  });
  const [isPublic, setIsPublic] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    isPublic: isPublic,
  });

    const [file, setFile] = useState();

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleIsPublic = () => {
    setIsPublic(!isPublic);
    setFormState({ ...formState, isPublic: !isPublic });
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
        closeModal={closeModal}
        heading={
          <>
            Create new {<span className="text-pri-5">{communityName}</span>}{" "}
            Item
          </>
        }
        btnLabel={"Create Item"}
        btnAction={createNewItem}
        body={
          <>
            <Input
              label="Item Name"
              warning={true}
              name={"name"}
              value={formState.name}
              change={handleFormChange}
            />
            <TextArea
              label={`Item Description`}
              name={"description"}
              value={formState.description}
              onChange={handleFormChange}
            />
            <Checkbox
              label="This item is public."
              onChange={handleIsPublic}
              checked={isPublic}
              name={"isPublic"}
            />
           <FileUpload file={file} onFileChange={setFile} />
          </>
        }
      />
    </>
  );
}
