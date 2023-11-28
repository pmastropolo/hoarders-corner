import { useQuery, useMutation } from "@apollo/client";
import {
  QUERY_COMMUNITY_ITEMS,
  QUERY_MY_MESSAGES,
  QUERY_COMMUNITIES,
  QUERY_USERS,
} from "../utils/queries";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Atoms/Button";
import {
  SEND_MESSAGE,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
} from "../utils/mutations";
import Auth from "../utils/auth";
import { useState } from "react";
import Modal from "../components/Modals/Modal";
import TextArea from "../components/Atoms/TextArea";
import PageHeader from "../components/Atoms/PageHeader";
import CreateItemForm from "../components/CreateItemForm/CreateItemForm";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import classes from "./itemss.css";

function IndividualItem({ name, description, owner, _id, openMessageModal, imageUrl }) {
  const [isHovered, setIsHovered] = useState(false);

  const descriptionStyle = {
    display: isHovered ? 'block' : 'none', 
  };

  return (
    <div className="border-x border-y rounded-lg shadow-lg border-b-[1px] border-opac-neu py-2 px-4 flex flex-col w-4/12" style={{ width: '30%' }}>
      <div className="px-1 py-1">
        <h1 className="text-h2 font-bold mb-1">{name}</h1>
        <div style={{ width: '100%', height: '2px', backgroundColor: 'black' }} />
        <p className="text-sm mt-1" style={{ marginTop: '2px' }}>Owned By {owner}</p>
      </div>
      <div className="flex flex-col w-full h-full py-3" style={{ position: 'relative' }}>
        {!imageUrl && <p>{description}</p>}
        {imageUrl && <>
          <img 
            src={imageUrl} 
            alt={name} 
            className={classes.image} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          {description && <p style={descriptionStyle}>{description}</p>}
        </>}
      </div>
      <div className="flex w-full py-3">
        <Button label="Message Owner" action={() => openMessageModal(owner)} />
      </div>
    </div>
  );
}

function MessageModal({ name, closeModal }) {
  const [textAreaValue, setTextAreaValue] = useState("");
  const [sendMessage, { error }] = useMutation(SEND_MESSAGE, {
    refetchQueries: [QUERY_MY_MESSAGES, "messages"],
  });

  const sendToOwner = async () => {
    console.log(textAreaValue);
    if (textAreaValue.trim()) {
      try {
        const { data } = await sendMessage({
          variables: {
            sender: Auth.getProfile().authenticatedPerson.username,
            recipient: name,
            content: textAreaValue.trim(),
          },
        });
      } catch (error) {
        console.error(error);
      }
      closeModal();
    }
  };

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  return (
    <div className="w-screen h-screen bg-[#00000080] absolute top-0 left-0">
      <div className="w-[640px] bg-neu-0 ">
        <Modal
          closeModal={closeModal}
          heading={
            <>
              Send Message to
              <span className="text-pri-5">{name}</span>
            </>
          }
          btnLabel="Send Message"
          body={
            <TextArea
              label={`Message to  ${name}`}
              onChange={handleTextAreaChange}
            />
          }
          btnAction={sendToOwner}
        />
      </div>
    </div>
  );
}

export default function MyCommunityItems() {
  if (!Auth.loggedIn()) {
    return (
      <div>
        <p>Must be logged in to view this page</p>
        <Link to="/">Go to Homepage</Link>
      </div>
    );
  }

  const navigate = useNavigate();

  const [messageModalState, setMessageModalState] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [messageModalData, setMessageModalData] = useState();
  const { communityId } = useParams();
  const [findItemValue, setFindItem] = useState("");
  const [renderOneItem, setRenderOneItem] = useState(null);

  const [joinCommunity, { error: joinCommunityError }] = useMutation(
    JOIN_COMMUNITY,
    {
      refetchQueries: [QUERY_COMMUNITY_ITEMS, "communities"],
    }
  );
  const [leaveCommunity, { err }] = useMutation(LEAVE_COMMUNITY, {
    refetchQueries: [QUERY_COMMUNITY_ITEMS, "items"],
  });
  const { loading, data, error } = useQuery(QUERY_COMMUNITY_ITEMS, {
    variables: { communityId: communityId },
  });
  
  if (loading) return <p>Loading..</p>;
  if (error) return <p>Error</p>;

  const communityItems = data?.itemByCommunity.items || [];
  // checks to see if the user is a member of the community they are viewing
  const joinedCommunity = data?.itemByCommunity.users.some(
    (user) => user._id === Auth.getProfile().authenticatedPerson._id
  );
 
  const myCommunityItems= data?.itemByCommunity.items.filter( (item) => item.owner === Auth.getProfile().authenticatedPerson.username);

  const handleGoBack = () => {
    navigate(-1);
  };

  const openMessageModal = (data) => {
    setMessageModalState(true);
    setMessageModalData(data);
  };

  const closeMessageModal = () => {
    setMessageModalState(false);
  };

  const openCreateItemModal = () => {
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
  };

  const joinCommunityAction = async (communityId) => {
    try {
      const { data } = await joinCommunity({
        variables: { communityId },
      });
    } catch (joinCommunityError) {
      console.log(joinCommunityError);
    }

    // data returns as array of communities but function still works

    if (communityId) {
      alert("Successfully Joined!");
    } else if (!communityId) {
      alert("Didn't successfully join");
    }
  };

  const leaveCommunityAction = async (communityId) => {
    //only leave community if I have no items in it
    if (myCommunityItems.length > 0) {
      alert("You have items in this community. Please remove them first");
      return;
    } else {
    try {
      const { data } = await leaveCommunity({ variables: { communityId } });
    } catch (error) {
      console.error(error);
    }

    if (communityId) {
      alert(`You are no longer following`);
    } else if (!communityId) {
      alert("Didn't successfully leave");
    }
  }
  };

  const handleSearchChange = (event) => {
    event.preventDefault();
    setFindItem(event.target.value);
  };

  const searchForItem = async (event) => {
    try {
      // checks for a matching value in the query's Communities.items.name values
      const itemInCommunity = data?.itemByCommunity.items.some(
        (name) => name.name === findItemValue
      )
      const publicItem = data?.itemByCommunity.items.find(
        (item) => item.name === findItemValue
      )

      if (itemInCommunity === true && publicItem.isPublic === true ) {
        const item = data?.itemByCommunity.items.find(
          (name) => name.name === `${findItemValue}`
        )
        setRenderOneItem(item)
      } else if (itemInCommunity === false || publicItem.isPublic === false ) {
        alert("Item not found or isn't public")
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex w-full items-center h-fit">
        <Button action={handleGoBack} icon={`fa-solid fa-arrow-left`} />
        <PageHeader
          label={`${data.itemByCommunity.name} ${data.itemByCommunity.tagline ? "#" : ""}${data.itemByCommunity.tagline}`}
          hasButton={joinedCommunity}
          btnLabel={`Add Item`}
          btnAction={openCreateItemModal}
        />
        <div className="ml-4">
          {joinedCommunity ? (
            <Button
              label={`Leave`}
              style={"warning"}
              action={() => leaveCommunityAction(communityId)}
            />
          ) : (
            <Button
              label={"Join"}
              action={() => joinCommunityAction(communityId)}
            />
          )}
        </div>
      </div>

      <div className="p-8 overflow-auto relative w-full">
        <div>
        <SearchBar
          bType={"submit"}
          btnAction={searchForItem}
          body={
            <input
              type="text"
              placeholder="Find an Item"
              value={findItemValue}
              onChange={handleSearchChange}
              className="w-100 h-7 pl-10 text-left"
            />
          }
        />
        </div>
        <div className="w-full bg-white border-collapse">

          {renderOneItem  ? (
            <IndividualItem
              openMessageModal={openMessageModal}
              _id={renderOneItem._id}
              name={renderOneItem.name}
              description={renderOneItem.description}
              owner={renderOneItem.owner}
              imageUrl={renderOneItem.imageUrl}
            />
          ) : (
          communityItems.length === 0 ? ( 
            <p className="border font-bold py-2 px-4 flex w-full text-center">No items in this community</p>
          ) : (
          <div className="flex flex-wrap gap-1">
            {communityItems.map(
              (item, index) =>
                item.isPublic && (
                  <IndividualItem
                    openMessageModal={openMessageModal}
                    _id={item._id}
                    name={item.name}
                    description={item.description}
                    owner={item.owner}
                    key={index}
                    imageUrl={item.imageUrl}
                  />
                )
            )}
          </div>
          )
          )}
        </div>
      </div>

      {messageModalState && (
        <MessageModal name={messageModalData} closeModal={closeMessageModal} />
      )}

      {showCreateModal && (
        <CreateItemForm
          communityName={data.itemByCommunity.name}
          closeModal={closeModal}
          communityId={communityId}
        />
      )}
    </>
  );
}
