import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [diff, setDiff] = useState("");
  const [tests, setTests] = useState("");
  const [loading, setLoading] = useState(false);

  const generateTests = async () => {

    try {

      setLoading(true);

      const response = await axios.post(
        "https://regression-suite-generator.onrender.com/generate-tests",
        { diff }
      );

      setTests(response.data.tests);

    } catch (error) {

      console.error(error);
      alert("Error generating tests");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="container">

      <h1>LLM Regression Test Generator</h1>

      <textarea
        placeholder="Paste GitHub PR diff here..."
        value={diff}
        onChange={(e) => setDiff(e.target.value)}
      />

      <button onClick={generateTests}>
        {loading ? "Generating..." : "Generate Tests"}
      </button>

      <pre>{tests}</pre>

    </div>
  );
}

export default App;