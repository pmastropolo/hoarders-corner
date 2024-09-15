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
    {data ? ( 
      <h2>
        You are signed up! <Link to="/">Back to Home</Link> 
      </h2>
    ) : (
      <div className="px-4"> 
        <form
          onSubmit={handleFormSubmit} 
          className={`flex flex-col gap-4 mt-6`}
        >
          <h4 className="text-h4 font-medium ">Sign Up</h4> 

          <Input
            label="Username"
            type="text"
            name="username"
            value={formState.username}
            change={handleFormChange}
          />
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

          <Button label="Sign Up" type="submit" /> 
        </form>
      </div>
    )}

    {error && <div>{error.message}</div>} 
  </div>
);
}
