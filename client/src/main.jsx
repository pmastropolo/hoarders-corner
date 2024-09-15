// IMPORT REACT DOM CLIENT
import ReactDOM from "react-dom/client";

// IMPORT ROUTING UTILITIES
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// IMPORT MAIN APP COMPONENT
import App from "./App.jsx";

// IMPORT PAGE COMPONENTS
import AllCommunities from "./pages/AllCommunities.jsx";
import MyCommunities from "./pages/MyCommunities.jsx";
import Messages from "./pages/Messages.jsx";
import MyCommunityItems from "./pages/MyCommunityItems.jsx";
import MyHoard from "./pages/MyHoard.jsx";
// import MyItemsCommunity from "./pages/MyItemsCommunity.jsx"; // COMMENTED OUT IMPORT

// CREATE ROUTER CONFIGURATION
const router = createBrowserRouter([
  {
    path: "/", // ROOT PATH
    element: <App />, // ROOT COMPONENT
    errorElement: <h1>Uh Oh!</h1>, // ERROR COMPONENT
    children: [
      {
        index: true, // DEFAULT CHILD ROUTE
        element: <AllCommunities />, // COMMUNITIES COMPONENT
      },
      {
        path: "/messages/received", // MESSAGES RECEIVED ROUTE
        element: <Messages />, // MESSAGES COMPONENT
      },
      {
        path: "/messages/sent", // MESSAGES SENT ROUTE
        element: <Messages />, // MESSAGES COMPONENT
      },
      {
        path: "my-communities", // MY COMMUNITIES ROUTE
        element: <MyCommunities />, // MY COMMUNITIES COMPONENT
      },
      {
        path: "/communities/:communityId", // COMMUNITY ITEMS ROUTE
        element: <MyCommunityItems />, // COMMUNITY ITEMS COMPONENT
      },
      {
        path: "/hoard/:id", // MY HOARD ROUTE
        element: <MyHoard />, // MY HOARD COMPONENT
      },
    ],
  },
]);

// RENDER APP WITH ROUTER
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} /> // PROVIDE ROUTER TO APP
);
