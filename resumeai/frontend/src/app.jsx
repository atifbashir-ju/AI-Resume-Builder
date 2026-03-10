import { useEffect, useState } from "react";
import { testAPI } from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    testAPI().then((data) => {
      setMessage(data.status);
    });
  }, []);

  return (
    <div>
      <h1>AI Resume Builder</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;