// IMPORT APOLLO CLIENT TOOLS
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

// IMPORT OUTLET FROM REACT ROUTER
import { Outlet } from "react-router-dom";

// IMPORT APOLLO CONTEXT FOR AUTH
import { setContext } from "@apollo/client/link/context";

// IMPORT COMPONENTS
// import Navbar from "./components/Navbar";
import LeftNav from "./components/LeftNav/LeftNav";
import { UserProvider } from "./utils/userContext";
import MobileNav from "./components/MobileNav/MobileNav";

// CREATE HTTP LINK FOR APOLLO CLIENT
const httpLink = createHttpLink({
  uri: "/graphql",
});

// CREATE AUTHENTICATION LINK
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// INITIALIZE APOLLO CLIENT
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// DEFINE APP COMPONENT
function App() {
  return (
    <>
      {/* WRAP APP WITH APOLLO PROVIDER */}
      <ApolloProvider client={client}>
        {/* MAIN APP LAYOUT */}
        <div className="lg:flex bg-neu-2 ">
          {/* PROVIDE USER CONTEXT */}
          <UserProvider>
            {/* MOBILE NAVIGATION */}
            <div className="lg:hidden">
              <MobileNav />
            </div>
            {/* LEFT NAVIGATION FOR LARGER SCREENS */}
            <div className="lg:block hidden">
              <LeftNav hasHeader={true} />
            </div>
            {/* CONTENT RENDERING AREA */}
            <div className="lg:w-full mx-8 my-6 h-full">
              <Outlet />
            </div>
          </UserProvider>
        </div>
        {/* NAVBAR COMPONENT (CURRENTLY COMMENTED OUT) */}
        {/* <Navbar /> */}
        {/* OUTLET FOR RENDERING ROUTED COMPONENTS */}
      </ApolloProvider>
    </>
  );
}

// EXPORT APP COMPONENT
export default App;
