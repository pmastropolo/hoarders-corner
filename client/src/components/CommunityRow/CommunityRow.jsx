import { useQuery, useMutation } from "@apollo/client"; // Import Apollo Client hooks
import Button from "../Atoms/Button"; // Import Button component
import { LEAVE_COMMUNITY } from "../../utils/mutations"; // Import leave community mutation
import {
  QUERY_MY_COMMUNITIES,
  QUERY_COMMUNITY_ITEMS,
} from "../../utils/queries";

import { Link } from "react-router-dom"; 
import Auth from "../../utils/auth";  // import auth utils
import classes from "./communityrow.css";  // Import Css

export default function CommunityRow({
  _id,
  name,
  members,
  items,
  tagline,
  isMyCommunity,
  join,
  hasButton,
  description,
}) {

  // Leave community mutation with refetch
  const [leaveCommunity, { err }] = useMutation(LEAVE_COMMUNITY, {
    refetchQueries: [QUERY_MY_COMMUNITIES, "communities"],
  });
  
  // Query community items with community ID
  const communityId = _id;
  const { loading, data, error } = useQuery(QUERY_COMMUNITY_ITEMS, {
    variables: { communityId: communityId },
  });

  // Filter community items by logged in user
  const myCommunityItems =
    (Auth.loggedIn() &&
      data?.itemByCommunity.items.filter(
        (item) => item.owner === Auth.getProfile().authenticatedPerson.username
      )) ||
    [];

  // Async function to leave community
  const leaveCommunityAction = async (communityId, communityName) => {
    if (myCommunityItems.length > 0) {
      alert("You have items in this community. Please remove them first");
      return;
    } else {
      try {
        const { data } = await leaveCommunity({ variables: { communityId } });
      } catch (error) {
        console.error(error);  // Log error to console
      }

      // If community ID exists
      if (communityId) {
        alert(`You are no longer following ${communityName}`);
      } else if (!communityId) {
        alert("Didn't successfully leave");  // Log error to Console
      }
    }
  };

  return (
  <div className="community-row">
    <div className="communityRow w-full bg-neu-0 h-16 flex rounded-lg shadow-md hover:shadow-lg cursor-pointer ">
      <div className="px-6 flex flex-col justify-center w-full">
        <div className={classes.overall}>
          <Link className="flex flex-col items-start" to={`/communities/${_id}`}>
            <h3 className="text-h3 font-bold text-pri-5 mr-1">{name}</h3>
            <p className="text-sm tagline">{tagline}</p> {/* Tagline right under the name */}
          </Link>
          {description && <p className={`${classes.desc} desc`}>{description}</p>}
        </div>
      </div>
     


      <div className="flex items-center min-w-[128px]">
        <i className="fa-solid fa-users mr-1 text-pri-5 "></i>
        <h4 className="text-h4 font-bold">{members} Members</h4>
      </div>
      <div className="flex items-center min-w-[96px]">
        <i className="fa-solid fa-tag mr-1 text-pri-5"></i>
        <h4 className="text-h4 font-bold">{items} Items</h4>
      </div>
      <div className="flex px-6 items-center h-full">
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
      </div>
    </div>

  );
}
