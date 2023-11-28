import PageHeader from "../components/Atoms/PageHeader";
import CommunityRow from "../components/CommunityRow/CommunityRow";
import { QUERY_MY_COMMUNITIES } from "../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_COMMUNITY } from "../utils/mutations";
import Modal from "../components/Modals/Modal";
import Auth from "../utils/auth";
import { Link } from "react-router-dom";

export default function MyCommunities() {
  if (!Auth.loggedIn()) {
    return (
      <div>
        <p>Must be logged in to view this page</p>
        <Link to="/">Go to Homepage</Link>
      </div>
    );
  }

  const { loading, data, error } = useQuery(QUERY_MY_COMMUNITIES);
  const [addCommunity, { error: addCommunityError }] = useMutation(
    ADD_COMMUNITY,
    {
      refetchQueries: [QUERY_MY_COMMUNITIES, "communities"],
    }
  );
  const [showModal, setShowModal] = useState(false);
  const [name, setInputValue] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  if (loading) return <p>...loading</p>;
  if (error) return <p>{error}</p>;

  const myCommunities = data?.myCommunities || [];

  // CREATE COMMUNITY
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

  // function for creating a community
  const submitCommunityForm = async (event) => {
    try {
      const { data } = await addCommunity({
        variables: { name, tagline, description },
      });
    } catch (err) {
      console.error(err);
    }

    if (data) {
      setShowModal(false);
      setInputValue("");
      setTagline("");
    } else {
      console.log("didn't create community");
    }
  };

  return (
    <>
      <div className="scroll-smooth sticky top-0 bg-neu-2">
        <PageHeader
        className="scroll-smooth sticky top-0 bg-neu-2"
        label="My Communities"
        icon="fa-solid fa-user"
        hasButton={true}
        btnLabel="Create Community"
        btnAction={handleCreateCommunity}
        />
      </div>
      {myCommunities.length === 0 ? (
        <p>You are not a member of any communities</p>
      ) : (
        <>
          <div className="w-full mt-2">
            <div className="flex flex-col gap-4">
              {myCommunities.communities.map((c, i) => (
                <CommunityRow
                key={i}
                _id={c._id}
                description={c.description}
                name={c.name}
                members={c.users.length}
                items={c.items.filter((i) => i.isPublic).length}
                isMyCommunity={true}
                tagline={c.tagline}
                hasButton={true}
                />
              ))}
            </div>
          </div>
          {showModal && (
            <Modal
              heading={"Create A Community"}
              body={
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Title it here"
                    className="px-3 py-2"
                    value={name}
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
                    className="px-3 py-2"
                    placeholder="Enter Tagline"
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
        </>
      )}
    </>
  );
}

