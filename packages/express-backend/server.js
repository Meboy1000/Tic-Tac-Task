import app from "./backend.js";

const port = process.env.PORT || 8000;

// Separated from backend.js so that unit testing can be isolated from server
app.listen(port, () => {
  console.log("REST API is listening.");
});
