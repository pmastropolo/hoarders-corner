import Auth from "../../utils/auth"; // Import auth utils
import LoginForm from "./LoginForm";  // import login component
import SignupForm from "./SignupForm";  // import signup form component

import { Link, useLocation } from "react-router-dom";
import Button from "../Atoms/Button";

import { QUERY_MY_HOARDS, QUERY_MY_MESSAGES, QUERY_COMMUNITIES, QUERY_MY_COMMUNITIES } from "../../utils/queries";
import { useQuery } from "@apollo/client";  // import useQuery hook from apollo client

import { useUserContext } from "../../utils/userContext";  // import user context
import { useEffect } from "react";

function MessagesTab() {
  const currentPage = useLocation().pathname;  // Gets current Page

  // Gets the count for the messages tab
  const { loading, data, error } = useQuery(QUERY_MY_MESSAGES);  // Execute messages query

  if (loading) return <h1>Loading..</h1>;  // handle loading state

  if (error) return <h1>{error}</h1>;  // handle error state

  const myMessages = data?.myMessages || [];  // get messeages data

  const unreadCount = myMessages.messagesReceived.filter(
    (m) => !m.isRead
  )?.length;  // Calculate unread count

  return (
    <div className=" h-14 flex items-center ">
      <Link
        className={`text-h3 font-bold h-full flex items-center px-4 ${
          currentPage === "/messages/received" ||
          currentPage === "/messages/sent"
            ? "text-pri-5 border-l-4 border-pri-5 pl-3"
            : "text-neu-7 "
        }`}
        to="/messages/received"
      >
        Messages
      </Link>

      {unreadCount > 0 && ( // Conditionally show unread count badge
        <div className="bg-pri-5 rounded-full h-6 w-6 flex items-center ">
          <p className="mx-auto text-neu-0">{unreadCount}</p>
        </div>
      )}
    </div>
  );
}

function MyHoards() {
  const { myHoards } = useUserContext();  // Get hoards from context

  return (
    myHoards.length > 0 && (
      <div>
        <SectionLabel label="My Hoards" />
        {myHoards.length === 0 ? (
          <p>You have not joined any communities</p>
        ) : (
          myHoards.map((h, i) => ( // map over hoards
            <NavLink key={i} label={h.name} to={`/hoard/${h._id}`} />
          ))
        )}
      </div>
    )
  );
}

function SectionLabel({ label }) { // reusable section label component
  return (
    <div className="px-4 h-14 flex items-center ">
      <h3 className="text-h3 font-bold text-neu-7">{label}</h3>
    </div>
  );
}

function NavLink({ to, label }) { // reusable navlink component
  const currentPage = useLocation().pathname;

  return (
    <div className="h-10 ">
      <Link
        className={`h-full px-8  text-h4 font-medium flex items-center hover:text-pri-5 ${
          currentPage === to
            ? "text-pri-5 border-l-4 border-pri-5 pl-7"
            : "text-neu-7 "
        }`}
        to={to}
      >
        {label}
      </Link>
    </div>
  );
}

export default function LeftNav() {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <>
      <div className={`bg-neu-0 h-full min-w-[290px] max-w-[290px]`}>
        <div className="h-14 bg-opac-pri flex px-4 py-4 items-center">
          <i className="fa-solid fa-box text-h3 text-pri-5 mr-2"></i>
          <h2 className="text-h2 font-bold text-neu-9">Hoarder's Corner</h2>
        </div>
        {Auth.loggedIn() ? (
          <div
            className="h-full flex flex-col"
            style={{ height: "calc(100vh - 56px)" }}
          >
            <div className="flex-grow overflow-auto">
              <MessagesTab />
              <SectionLabel label="Communities" />
              <NavLink label="All Communities" to="/" />
              <NavLink label="My Communities" to="/my-communities" />
              <MyHoards />
            </div>
            <div className="w-full bg-neu-0 px-4 py-2 border-t-2 border-opac-neu flex-shrink">
              <Button label="Log Out" style="w-full" action={logout} />
            </div>
          </div>
        ) : (
          <div>
            <LoginForm />
            <SignupForm />
          </div>
        )}
      </div>
    </>
  );
}
