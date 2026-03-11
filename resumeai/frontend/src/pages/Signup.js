import { useState } from "react";
import { signupUser } from "../api";



function Signup() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSignup = async () => {

    try {

      const response = await signupUser({
        name,
        email,
        password
      });

      alert("Signup successful");

      console.log(response);

    } catch (error) {

      alert("Signup failed");

    }

  };

  return (
    <div>

      <input placeholder="Name" onChange={(e)=>setName(e.target.value)} />

      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />

      <input placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

      <button onClick={handleSignup}>
        Signup
      </button>

    </div>
  );
}

export default Signup;