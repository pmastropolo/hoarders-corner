// IMPORT APOLLO CLIENT HOOK
import { useQuery } from "@apollo/client";

// IMPORT REACT HOOKS
import { createContext, useContext, useEffect, useState } from "react";

// IMPORT GRAPHQL QUERY
import { QUERY_MY_HOARDS } from "./queries";

// IMPORT AUTH UTILITY
import Auth from "../utils/auth";

// CREATE USER CONTEXT
const UserContext = createContext();

// HOOK TO USE USER CONTEXT
export const useUserContext = () => useContext(UserContext);

// PROVIDER COMPONENT FOR USER CONTEXT
export const UserProvider = ({ children }) => {
  // STATE FOR USER'S HOARDS
  const [myHoards, setMyHoards] = useState([]);

  // QUERY FOR USER'S HOARDS
  const { loading, data, error } = useQuery(QUERY_MY_HOARDS);

  // EFFECT TO HANDLE QUERY RESULT
  useEffect(() => {
    // HANDLE LOADING STATE
    if (loading) setMyHoards(<p>...loading</p>);
    // HANDLE ERROR STATE
    if (error) setMyHoards(<p>{error}</p>);
    // HANDLE SUCCESSFUL QUERY
    if (data) {
      // FILTER UNIQUE HOARDS BASED ON USER ID
      const uniqueHoards = data?.myHoards.communities.filter((community) =>
        community.items.some(
          (item) =>
            item.ownerId?._id === Auth.getProfile().authenticatedPerson._id
        )
      );

      // UPDATE STATE WITH FILTERED HOARDS
      setMyHoards(uniqueHoards);
    }
  }, [loading, data, error]);

  // PROVIDE CONTEXT TO CHILD COMPONENTS
  return (
    <UserContext.Provider value={{ myHoards }}>{children}</UserContext.Provider>
  );
};
