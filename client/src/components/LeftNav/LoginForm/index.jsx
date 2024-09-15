import { useState } from "react"; // IMPORT USESTATE HOOK FROM REACT
import { LOGIN_USER } from "../../../utils/mutations"; // IMPORT LOGIN USER MUTATION
import { useMutation } from "@apollo/client"; // IMPORT USEMUTATION HOOK FROM APOLLO CLIENT
import { Link } from "react-router-dom"; // IMPORT LINK COMPONENT FROM REACT ROUTER

import Auth from "../../../utils/auth"; // IMPORT AUTHENTICATION UTILITIES

import Input from "../../Atoms/Input"; // IMPORT INPUT COMPONENT
import Button from "../../Atoms/Button"; // IMPORT BUTTON COMPONENT

export default function LoginForm() {
  const [formState, setFormState] = useState({ // INITIALIZE FORM STATE
    email: "", // FORM STATE FOR EMAIL
    password: "", // FORM STATE FOR PASSWORD
  });
  const [login, { error, data }] = useMutation(LOGIN_USER); // USE LOGIN MUTATION

  const handleFormChange = (event) => { // FUNCTION TO HANDLE FORM CHANGES
    const { name, value } = event.target; // DESTRUCTURE NAME AND VALUE FROM EVENT

    setFormState({ // UPDATE FORM STATE
      ...formState, // PRESERVE PREVIOUS STATE
      [name]: value, // SET NEW VALUE FOR SPECIFIED NAME
    });
  };
}

const handleFormSubmit = async (event) => { // FUNCTION TO HANDLE FORM SUBMISSION
  event.preventDefault(); // PREVENT DEFAULT FORM SUBMIT BEHAVIOR
  try {
    const { data } = await login({ variables: { ...formState } }); // ATTEMPT TO LOGIN WITH FORM STATE
    Auth.login(data.login.token); // LOGIN WITH RECEIVED TOKEN
  } catch (error) {
    console.error(error); // LOG ANY ERRORS
  }
};

return (
  <>
    <div id="login-card ">
      {data ? ( 
        <h2>
          You are logged in!<Link to="/">Back to Home</Link> 
        </h2>
      ) : (
        <div className="px-4"> 
          <form
            onSubmit={handleFormSubmit} 
            className="flex flex-col gap-4 border-b-2 border-opac-neu pb-4  "
          >
            <h4 className="text-h4 font-medium mt-4">Login</h4> 

            <Input
              label="Email" 
              type="email"
              name="email"
              value={formState.email}
              change={handleFormChange}
            />

            <Input
              label="Password" 
              type="password"
              name="password"
              value={formState.password}
              change={handleFormChange}
            />
            <Button label="Login" type="submit" /> 
          </form>
        </div>
      )}

      {error && <div>{error.message}</div>} 
    </div>
  </>
);
}
