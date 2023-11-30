import { Link } from "react-router-dom"; // IMPORT LINK COMPONENT FROM REACT ROUTER
import { LEAVE_COMMUNITY } from "../../utils/mutations"; // IMPORT LEAVE COMMUNITY MUTATION
import { QUERY_COMMUNITY_ITEMS, QUERY_MY_COMMUNITIES } from "../../utils/queries"; // IMPORT GRAPHQL QUERIES
import { useMutation, useQuery } from "@apollo/client"; // IMPORT HOOKS FROM APOLLO CLIENT
import Button from "../Atoms/Button"; // IMPORT BUTTON COMPONENT
import Auth from "../../utils/auth"; // IMPORT AUTHENTICATION UTILITIES

export default function ResCommunityCard({
  _id,
  name,
  members,
  items,
  isMyCommunity,
  join,
  hasButton,
}) {
  const [leaveCommunity, { err }] = useMutation(LEAVE_COMMUNITY, {
    refetchQueries: [QUERY_MY_COMMUNITIES, "communities"], // SETUP LEAVE COMMUNITY MUTATION WITH REFETCH
  });
  
  const communityId = _id; // SET COMMUNITY ID FROM PROP
  const { loading, data, error } = useQuery(QUERY_COMMUNITY_ITEMS, {
    variables: { communityId: communityId }, // QUERY COMMUNITY ITEMS WITH COMMUNITY ID
  });
  
  const myCommunityItems =
    (Auth.loggedIn() && // CHECK IF USER IS LOGGED IN
      data?.itemByCommunity.items.filter( // FILTER ITEMS BY OWNER
        (item) => item.owner === Auth.getProfile().authenticatedPerson.username
      )) ||
    []; // DEFAULT TO EMPTY ARRAY IF CONDITION FAILS

const leaveCommunityAction = async (communityId, communityName) => { // ASYNC FUNCTION FOR LEAVING COMMUNITY
  if (myCommunityItems.length > 0) { // CHECK IF USER HAS ITEMS IN THE COMMUNITY
    alert("You have items in this community. Please remove them first"); // ALERT IF ITEMS EXIST IN COMMUNITY
    return; // EXIT FUNCTION IF ITEMS EXIST
  } else {
    try {
      const { data } = await leaveCommunity({ variables: { communityId } }); // ATTEMPT TO LEAVE COMMUNITY
    } catch (error) {
      console.error(error); // CATCH AND LOG ANY ERRORS
    }

    if (communityId) { // CHECK IF COMMUNITY ID EXISTS
      alert(`You are no longer following ${communityName}`); // ALERT SUCCESSFUL DEPARTURE
    } else if (!communityId) { // CHECK IF COMMUNITY ID DOES NOT EXIST
      alert("Didn't successfully leave"); // ALERT FAILED ATTEMPT TO LEAVE
    }
  }
};
  
return (
  <div className="w-full bg-neu-0 rounded-lg shadow-md p-6"> 
    <Link className="flex gap-4 items-center mb-4" to={`/communities/${_id}`}> 
      <h3 className="text-h3 font-bold text-pri-5">{name}</h3> 
      <i className="fa-solid fa-arrow-right"></i> 
    </Link>
    <div className="flex items-center min-w-[128px] mb-3"> 
      <i className="fa-solid fa-users mr-1 text-pri-5 "></i> 
      <h4 className="text-h4 font-bold">{members} Members</h4> 
    </div>
    <div className="flex items-center min-w-[96px] mb-3"> 
      <i className="fa-solid fa-tag mr-1 text-pri-5"></i> 
      <h4 className="text-h4 font-bold">{items} Items</h4> 
    </div>
    {hasButton &&
      (isMyCommunity ? (
        <Button
          label="Leave"
          action={() => leaveCommunityAction(_id, name)}
          style="warning" 
        />
      ) : (
        <Button label="Join" action={() => join(_id)} /> 
      ))}
  </div>
);
}
