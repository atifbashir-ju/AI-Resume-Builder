const API_URL = import.meta.env.VITE_API_URL;

export const testAPI = async () => {
  const res = await fetch(`${API_URL}/test`);
  return res.json();
};



