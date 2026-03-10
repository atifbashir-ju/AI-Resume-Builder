const API_URL = "https://the-ai-resume-builder-1.onrender.com";

export const signupUser = async (data) => {

  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  return result;

};