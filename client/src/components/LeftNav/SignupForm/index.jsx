import { useState } from "react"; // IMPORT USESTATE HOOK FROM REACT
import { CREATE_USER } from "../../../utils/mutations"; // IMPORT CREATE USER MUTATION
import { useMutation } from "@apollo/client"; // IMPORT USEMUTATION HOOK FROM APOLLO CLIENT
import { Link } from "react-router-dom"; // IMPORT LINK COMPONENT FROM REACT ROUTER
import Auth from "../../../utils/auth"; // IMPORT AUTH UTILITIES
import Input from "../../Atoms/Input"; // IMPORT INPUT COMPONENT
import Button from "../../Atoms/Button"; // IMPORT BUTTON COMPONENT

export default function SignupForm() {
  const [formState, setFormState] = useState({ // INITIALIZE FORM STATE
    username: "", // FORM STATE FOR USERNAME
    email: "", // FORM STATE FOR EMAIL
    password: "", // FORM STATE FOR PASSWORD
  });
  const [createUser, { error, data }] = useMutation(CREATE_USER); // USE CREATE USER MUTATION

  const handleFormChange = (event) => { // FUNCTION TO HANDLE FORM CHANGES
    const { name, value } = event.target; // DESTRUCTURE NAME AND VALUE FROM EVENT TARGET

    setFormState({ // UPDATE FORM STATE
      ...formState, // PRESERVE PREVIOUS STATE
      [name]: value, // SET NEW VALUE FOR THE SPECIFIED NAME
    });
  };
}

const handleFormSubmit = async (event) => { // ASYNC FUNCTION TO HANDLE FORM SUBMIT
  event.preventDefault(); // PREVENT DEFAULT FORM SUBMISSION

  try {
    const { data } = await createUser({ // ATTEMPT TO CREATE USER
      variables: { ...formState }, // PASS FORM STATE AS VARIABLES
    });

    Auth.login(data.createUser.token); // LOGIN USER AFTER CREATION
  } catch (error) {
    console.error(error); // LOG ANY ERRORS
  }
};

return (
  <div>
    {data ? ( // CHECK IF USER IS SIGNED UP
      <h2>
        You are signed up! <Link to="/">Back to Home</Link> // DISPLAY SIGNUP SUCCESS MESSAGE AND LINK TO HOME
      </h2>
    ) : (
      <div className="px-4"> // SIGNUP FORM CONTAINER
        <form
          onSubmit={handleFormSubmit} // SET FORM SUBMIT HANDLER
          className={`flex flex-col gap-4 mt-6`}
        >
          <h4 className="text-h4 font-medium ">Sign Up</h4> // SIGN UP HEADER

          <Input
            label="Username" // USERNAME INPUT FIELD
            type="text"
            name="username"
            value={formState.username}
            change={handleFormChange}
          />
          <Input
            label="Email" // EMAIL INPUT FIELD
            type="email"
            name="email"
            value={formState.email}
            change={handleFormChange}
          />
          <Input
            label="Password" // PASSWORD INPUT FIELD
            type="password"
            name="password"
            value={formState.password}
            change={handleFormChange}
          />

          <Button label="Sign Up" type="submit" /> // SIGN UP BUTTON
        </form>
      </div>
    )}

    {error && <div>{error.message}</div>} // DISPLAY ANY ERROR MESSAGES
  </div>
);
}
