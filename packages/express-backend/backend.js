import express from "express";
import cors from "cors";
import userService from "./user-services.js";



const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  userService
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving users");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  userService
    .findUserById(id)
    .then((user) => {
      if (!user) res.status(404).send("User not found");
      else res.send(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error retrieving user");
    });
});


app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService
    .deleteUserById(id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send("User not found.");
      }
      res.status(204).send();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.post("/users", (req, res) => {
  const user = req.body;
  userService
    .addUser(user)
    .then((savedUser) => {
      res.status(201).send(savedUser);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error saving user");
    });
});












