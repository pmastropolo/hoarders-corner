import { useState, useRef, useEffect } from "react"; // IMPORT REACT HOOKS
import LeftNav from "../LeftNav/LeftNav"; // IMPORT LEFTNAV COMPONENT

const OutsideClickHandler = ({ children, onOutsideClick, showNav }) => { // COMPONENT TO HANDLE OUTSIDE CLICKS
  const containerRef = useRef(); // USE REF TO TRACK THE CONTAINER ELEMENT

  useEffect(() => { // USE EFFECT HOOK
    const handleOutsideClick = (e) => { // FUNCTION TO HANDLE OUTSIDE CLICK
      if (containerRef.current && !containerRef.current.contains(e.target)) { // CHECK IF CLICK IS OUTSIDE CONTAINER
        showNav && onOutsideClick(); // CALL ONOUTSIDECLICK IF NAV IS SHOWN
      }
    };

    document.addEventListener("mousedown", handleOutsideClick); // ADD MOUSE DOWN EVENT LISTENER

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick); // CLEANUP EVENT LISTENER
    };
  }, [onOutsideClick, showNav]); // DEPENDENCIES FOR EFFECT

  return <div ref={containerRef}>{children}</div>; // CONTAINER DIV WITH REF
};

export default function MobileNav() {
  const [showNav, setShowNav] = useState(false); // STATE FOR TOGGLING NAVIGATION

  const handleNav = () => { // FUNCTION TO TOGGLE NAVIGATION
    setShowNav(!showNav);
  };

  return (
    <> // FRAGMENT FOR COMPONENT STRUCTURE
      <OutsideClickHandler onOutsideClick={handleNav} showNav={showNav}> // OUTSIDE CLICK HANDLER COMPONENT
        <div className="bg-neu-0"> // CONTAINER DIV
          <div className="h-14 bg-opac-pri flex px-4 py-4 items-center "> // NAVBAR STYLING
            <i
              className="fa-solid fa-bars text-h3 text-pri-5 mr-4"
              onClick={handleNav} // ICON TO TOGGLE NAV
            ></i>
            <h2 className="text-h2 font-bold w-full text-neu-9">
              Hoarder's Corner // NAVBAR TITLE
            </h2>
          </div>
        </div>
        <div
          className={`absolute z-20 shadow-2xl transition-transform ${
            !showNav && "-left-[290px]" // CONDITIONAL STYLING FOR NAV VISIBILITY
          }`}
        >
          <LeftNav /> // LEFT NAV COMPONENT
        </div>
      </OutsideClickHandler>
    </>
  );
}
