import { useQuery, useMutation } from "@apollo/client"; // IMPORT APOLLO CLIENT HOOKS
import Button from "../Atoms/Button"; // IMPORT BUTTON COMPONENT
import { LEAVE_COMMUNITY } from "../../utils/mutations"; // IMPORT LEAVE COMMUNITY MUTATION
import {
  QUERY_MY_COMMUNITIES,
  QUERY_COMMUNITY_ITEMS,
} from "../../utils/queries"; // IMPORT GRAPHQL QUERIES

import { Link } from "react-router-dom"; // IMPORT LINK COMPONENT FROM REACT ROUTER
import Auth from "../../utils/auth"; // IMPORT AUTHENTICATION UTILS
import classes from "./communityrow.css"; // IMPORT CSS STYLES

export default function CommunityRow({
  _id, // PROP: COMMUNITY ID
  name, // PROP: COMMUNITY NAME
  members, // PROP: COMMUNITY MEMBERS
  items, // PROP: COMMUNITY ITEMS
  tagline, // PROP: COMMUNITY TAGLINE
  isMyCommunity, // PROP: FLAG IF IT'S USER'S COMMUNITY
  join, // PROP: JOIN FUNCTION
  hasButton, // PROP: FLAG TO SHOW/HIDE BUTTON
  description, // PROP: COMMUNITY DESCRIPTION
}) {

const [leaveCommunity, { err }] = useMutation(LEAVE_COMMUNITY, {
  refetchQueries: [QUERY_MY_COMMUNITIES, "communities"], // INITIALIZE MUTATION WITH REFETCH QUERIES
});
const communityId = _id; // SET COMMUNITY ID
const { loading, data, error } = useQuery(QUERY_COMMUNITY_ITEMS, { // FETCH COMMUNITY ITEMS
  variables: { communityId: communityId }, // SET QUERY VARIABLES
});

const myCommunityItems = 
  (Auth.loggedIn() && // CHECK IF USER IS LOGGED IN
    data?.itemByCommunity.items.filter( // FILTER ITEMS OWNED BY USER
      (item) => item.owner === Auth.getProfile().authenticatedPerson.username
    )) ||
  []; // DEFAULT TO EMPTY ARRAY IF CONDITION FAILS

const leaveCommunityAction = async (communityId, communityName) => { // ASYNC FUNCTION TO HANDLE LEAVING COMMUNITY
  if (myCommunityItems.length > 0) { // CHECK IF USER HAS ITEMS IN COMMUNITY
    alert("You have items in this community. Please remove them first"); // ALERT IF USER HAS ITEMS
    return; // EXIT FUNCTION
  } else {
    try {
      const { data } = await leaveCommunity({ variables: { communityId } }); // ATTEMPT TO LEAVE COMMUNITY
    } catch (error) {
      console.error(error); // CATCH AND LOG ERRORS
    }

    if (communityId) { // CHECK IF COMMUNITY ID EXISTS
      alert(`You are no longer following ${communityName}`); // ALERT USER THEY LEFT COMMUNITY
    } else if (!communityId) { // IF NO COMMUNITY ID
      alert("Didn't successfully leave"); // ALERT FAILURE TO LEAVE
    }
  }
};

return (
  <div className="w-full bg-neu-0 h-16 flex rounded-lg shadow-md hover:shadow-lg cursor-pointer "> // CONTAINER DIV
    <div className="px-6 flex flex-col justify-center w-full"> // FLEX BOX FOR CONTENT
      <div className={classes.overall}> // STYLED DIV FOR NAME AND DESCRIPTION
        <Link className="flex items-center" to={`/communities/${_id}`}> // LINK TO COMMUNITY PAGE
          <h3 className="text-h3 font-bold text-pri-5 mr-1">{name}</h3> // COMMUNITY NAME
          <i className="fa-solid fa-arrow-right"></i> // ARROW ICON
        </Link>
        {description && <p className={classes.desc}>{description}</p>} // CONDITIONAL RENDERING OF DESCRIPTION
      </div>
    </div>
    <div className="flex items-center min-w-[128px] mr-2"> // CONTAINER FOR TAGLINE
      <p className="text-sm w-full">{tagline}</p> // DISPLAY TAGLINE
    </div>
    <div className="flex items-center min-w-[128px]"> // CONTAINER FOR MEMBERS INFO
      <i className="fa-solid fa-users mr-1 text-pri-5 "></i> // USERS ICON
      <h4 className="text-h4 font-bold">{members} Members</h4> // MEMBERS COUNT
    </div>
    <div className="flex items-center min-w-[96px]"> // CONTAINER FOR ITEMS INFO
      <i className="fa-solid fa-tag mr-1 text-pri-5"></i> // TAG ICON
      <h4 className="text-h4 font-bold">{items} Items</h4> // ITEMS COUNT
    </div>
    <div className="flex px-6 items-center h-full"> // CONTAINER FOR BUTTON
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
      {/* CONDITIONAL RENDERING FOR JOIN/LEAVE BUTTON */}
    </div>
  </div>
);
}
