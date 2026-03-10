const handleSubmit = async () => {

  if (!name || !email || !password || !confirm) {
    toast.error("Please fill all fields");
    return;
  }

  if (password !== confirm) {
    toast.error("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  setLoading(true);

  try {

    const { data } = await axios.post(
      `${API}/api/auth/signup`,
      { name, email, password }
    );

    login(data.user, data.access_token);
    toast.success("Account created!");
    navigate("/dashboard");

  } catch (err) {

    toast.error(err.response?.data?.detail || "Signup failed");

  } finally {

    setLoading(false);

  }

};


import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {

  const [name] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [loading,setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const API = "https://ai-resume-builder-3-dhln.onrender.com";

  const handleSubmit = async () => {

    if (!name || !email || !password || !confirm) {
      toast.error("Please fill all fields");
      return;
    }

    try {

      const { data } = await axios.post(
        `${API}/api/auth/signup`,
        { name, email, password }
      );

      login(data.user, data.access_token);
      navigate("/dashboard");

    } catch (err) {
      toast.error("Signup failed");
    }

  };

  return (
    <button onClick={handleSubmit}>Create Account</button>
  );
}