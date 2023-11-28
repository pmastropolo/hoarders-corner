import Auth from "../utils/auth";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import {
  QUERY_COMMUNITIES,
  QUERY_MY_COMMUNITIES,
  QUERY_COMMUNITY,
} from "../utils/queries";
import { ADD_COMMUNITY, LEAVE_COMMUNITY } from "../utils/mutations";
import { JOIN_COMMUNITY } from "../utils/mutations";

import CommunityRow from "../components/CommunityRow/CommunityRow";
import PageHeader from "../components/Atoms/PageHeader";
import Modal from "../components/Modals/Modal";
import SearchBar from "../components/SearchBar";
import ResCommunityCard from "../components/ResCommunityCard/ResCommunityCard";

const isLogged = Auth.loggedIn();

const styles = {
  parentDiv: {
    width: "100%",
    border: "1px solid black",
  },
};

export default function AllCommunities() {
  const [showModal, setShowModal] = useState(false);
  const [name, setInputValue] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [findCommunityValue, setFindCommunity] = useState("");

  const { loading, data, error } = useQuery(QUERY_COMMUNITIES);
  const {
    loading: communityLoading,
    data: communityData,
    error: communityError,
  } = useQuery(QUERY_COMMUNITY, {
    variables: { name: findCommunityValue },
  });

  const [addCommunity, { error: addCommunityError }] = useMutation(
    ADD_COMMUNITY,
    {
      refetchQueries: [QUERY_COMMUNITIES, "communities"],
    }
  );

  const [joinCommunity, { error: joinCommunityError }] = useMutation(
    JOIN_COMMUNITY,
    {
      refetchQueries: [QUERY_COMMUNITIES, "communities"],
    }
  );

  if (loading) return <p>Loading..</p>;
  if (error) return <p>Error</p>;

  const communities = data?.communities || [];

  const oneCommunity = communityData?.communityName || [];

  // displays Modal since set to true
  const handleCreateCommunity = () => {
    setShowModal(true);
    setInputValue("");
  };

  // grabs user input
  const handleInputChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const handleChangeTagline = (event) => {
    event.preventDefault();
    setTagline(event.target.value);
  };

  const handleChangeDescription = (event) => {
    event.preventDefault();
    setDescription(event.target.value);
  };



  const handleSearchChange = (event) => {
    event.preventDefault();
    setFindCommunity(event.target.value);
    console.log(findCommunityValue);
  };

  // function for creating a community
  const submitCommunityForm = async (event) => {
    try {
      const { data } = await addCommunity({
        variables: { name, tagline, description },
      });
    } catch (addCommunityError) {
      console.log(addCommunityError);
      if (addCommunityError.message.includes("E11000")) {
        alert(`${name} Community already exists`);
      }
    }

    if (data) {
      setShowModal(false);
      setInputValue("");
      setTagline("");
    } else {
      console.log("didn't create community");
    }
  };

  const searchForCommunity = async (event) => {
    try {
      console.log(oneCommunity);
      console.log(oneCommunity._id);
      if (!oneCommunity._id) {
        alert("Community not found");
        setFindCommunity("");
      } else {
        window.location.href = `/communities/${oneCommunity._id}`;
      }
    } catch (error) {
      console.log(error);
    }
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

  const myUserId = isLogged && Auth.getProfile().authenticatedPerson._id;

  return (
    <div className="container">
      <PageHeader
        icon={"fa-solid fa-users"}
        label="All Communities"
        hasButton={isLogged && true}
        btnLabel={"Create Community"}
        btnAction={handleCreateCommunity}
      />
      <div className="w-full mt-2">
        <SearchBar
          bType={"submit"}
          btnAction={searchForCommunity}
          body={
            <input
              type="text"
              placeholder="Find a Community"
              value={findCommunityValue}
              onChange={handleSearchChange}
              className="w-100 h-7 pl-10 text-left"
            />
          }
        />
        <div className="flex flex-col gap-4">
          {communities.map((c, i) => (
            <CommunityRow
              key={i}
              _id={c._id}
              name={c.name}
              members={c.users.length}
              description={c.description}
              items={c.items.filter((i) => i.isPublic).length}
              join={joinCommunityAction}
              hasButton={isLogged === true}
              tagline={c.tagline}
              isMyCommunity={c.users.some((user) => user._id === myUserId)}
            />
          ))}
          {showModal && (
            <Modal
              heading={"Create A Community"}
              body={
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Title it here"
                    value={name}
                    className="px-3 py-2"
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    placeholder="Enter Description"
                    value={description}
                    className="px-3 py-2"
                    onChange={handleChangeDescription}
                  />
                  <textarea
                    type="text"
                    placeholder="Enter Tagline"
                    multiple
                    className="px-3 py-2"
                    value={tagline}
                    onChange={handleChangeTagline}
                  />
                </div>
              }
              btnLabel={"Create"}
              btnAction={() => submitCommunityForm()}
              closeModal={() => setShowModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
