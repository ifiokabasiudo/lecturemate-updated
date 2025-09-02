const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const { PineconeClient } = require("@pinecone-database/pinecone");
const { setCookie } = require("../utils/cookies");
const cors = require("cors");
require("dotenv").config()

const app = express();
const port = 4000;

app.use(cors());

// Initialize Openai
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

if (!configuration.apiKey) {
  console.log("Error");
  // return;
} else {
  console.log("It's working");
}

// Declare constants
const COMPLETIONS_MODEL = "text-davinci-003";
const EMBEDDING_MODEL = "text-embedding-ada-002";
const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supaUrl, supaKey);
app.use(express.json());

app.post("/api/api", async (req, res) => {
  console.log(req.body);
  const { token } = req.body;
  setCookie(res, "token", token, { path: "https://lecturemate.vercel.app/app/chat", maxAge: 2592000 });
  const setTokenKey = res.getHeader("Set-Cookie")[0];
  console.log("Log Token", token);
  const regex = /token=([^;]+)/;
  const match = setTokenKey.match(regex);
  const tokenValue = token;
  console.log(`lecture-mate-${tokenValue}`);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not properly configured",
      },
    });
    return;
  }

  const query = req.body.query || "";

  if (query.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a question",
      },
    });
    return;
  }

  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: "us-central1-gcp",
    apiKey: "05cb4d94-686d-4d1b-b412-fb561175026b",
  });
  console.log("pinecone point:", query);

  const queryEmbedding = await openai.createEmbedding({
    model: EMBEDDING_MODEL,
    input: query,
  });
  console.log("openai point:", query);

  const xq = queryEmbedding.data.data[0].embedding;

  const queryIndex = pinecone.Index("lecture-mate");

  const queryRes = await queryIndex.query({
    queryRequest: {
      namespace: `lecture-mate-${tokenValue}`,
      vector: xq,
      topK: 1,
      includeMetadata: true,
    },
  });
  let info = "";
  if (queryRes && queryRes.matches && queryRes.matches.length > 0) {
    const firstMatch = queryRes.matches[0];
    if (firstMatch.metadata && typeof firstMatch.metadata.text === "string") {
      info = firstMatch.metadata.text;
    }
  }
  console.log("Query Info:", info);
  const finalPrompt = `
      Info: ${info}
      Question: ${query}. 
      Answer:
    `;
  try {
    const response = await openai.createCompletion({
      model: COMPLETIONS_MODEL,
      prompt: finalPrompt,
      max_tokens: 2048,
    });

    const completion = response.data.choices[0].text;
    console.log(completion);
    res.status(200).send({ query, result: completion });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
