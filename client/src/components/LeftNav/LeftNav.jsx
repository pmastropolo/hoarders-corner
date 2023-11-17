import Auth from "../../utils/auth";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

import { Link, useLocation } from "react-router-dom";
import Button from "../Atoms/Forms/Buttons/Botton";

const tempHoards = [
  {
    name: "Books",
  },
  {
    name: "Magic the Gathering",
  },
  {
    name: "Bottle Caps",
  },
];

function MessagesTab() {
  const currentPage = useLocation().pathname;
  // temprory condition until data base has message data
  const hasMessages = true;
  return (
    <div className=" h-14 flex items-center ">
      <Link
        className={`text-h3 font-bold h-full flex items-center px-4 ${
          currentPage === "/messages"
            ? "text-pri-5 border-l-4 border-pri-5 pl-3"
            : "text-neu-7 "
        }`}
        to="/messages"
      >
        Messages
      </Link>

      {hasMessages && (
        <div className="bg-pri-5 rounded-full h-6 w-6 flex items-center ">
          <p className="mx-auto text-neu-0">3</p>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ label }) {
  return (
    <div className="px-4 h-14 flex items-center ">
      <h3 className="text-h3 font-bold text-neu-7">{label}</h3>
    </div>
  );
}

function NavLink({ to, label }) {
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
  const logout = () => {
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
              <SectionLabel label="My Hoards" />
              {/* The following bit is temporary to render when we have data and items to render */}
              {tempHoards.map((item, index) => (
                <NavLink key={index} label={item.name} to={`/${item.name}`} />
              ))}{" "}
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