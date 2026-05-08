import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.post("/generate-tests", async (req, res) => {

  try {

    const diff = req.body.diff;

    const prompt = `
You are a senior QA automation engineer.

Analyze this GitHub PR diff.

Generate:
1. Functional regression tests
2. Edge case tests
3. Failure scenario tests

Return executable pytest code only.

PR Diff:
${diff}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      }
    );

    const generatedText =
      response.data.candidates[0].content.parts[0].text;

    res.json({
      tests: generatedText
    });

  } catch (error) {

    console.error(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to generate tests"
    });

  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});