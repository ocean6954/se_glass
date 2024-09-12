const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
const PORT = 5001;

app.get("/github/:username", async (req, res) => {
  const { username } = req.params;
  const githubApiUrl = `https://github.com/users/${username}/contributions`;

  try {
    const response = await axios.get(githubApiUrl);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    res.status(500).send("Error fetching GitHub data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
