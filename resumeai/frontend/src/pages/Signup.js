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