import express from "express";
import cors from "cors";

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

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};


const findUserById = (id) => 
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  const newUser = {
    ...user,
    id: Math.random().toString(36).substr(2, 9),
  };
  users["users_list"].push(newUser);
  return newUser;
};


const deleteUserById = (id) => {
  const index = users["users_list"].findIndex(user => user.id === id);
  if (index === -1) return false; 
  users["users_list"].splice(index, 1);
  return true; 
};

const findUsers = (name, job) => {
  return users["users_list"].filter(user => {
    let match = true;

    if (name) {
      if (user.name.toLowerCase() !== name.toLowerCase()) {
        match = false;
      }
    }

    if (job) {
      if (user.job.toLowerCase() !== job.toLowerCase()) {
        match = false;
      }
    }

    return match;
  });
};


app.get("/users", (req, res) => {
  const { name, job } = req.query;

  if (!name && !job) {
    return res.send(users);
  }

  const result = findUsers(name, job);

  if (result.length === 0) {
    return res.status(404).send("Resource not found.");
  }

  res.send({ users_list: result });
});


app.get("/users/:id", (req, res) => {
  const id = req.params.id; 
  const result = findUserById(id);

  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deleted = deleteUserById(id);

  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).send("User not found.");
  }
});

app.post("/users", (req, res) => {
  const user = req.body;

  if (!user.name || !user.job) {
    return res.status(400).send("Missing name or job");
  }

  const newUser = addUser(user);
  res.status(201).send(newUser);
});











