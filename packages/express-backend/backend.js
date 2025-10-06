import express from "express";

const app = express();
const port = 8000;



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
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};



const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) => 
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex(user => user.id === id);
  if (index === -1) return false; // user not found
  users["users_list"].splice(index, 1);
  return true; // user deleted
};

const findUsersByNameAndJob = (name, job) => {
  return users["users_list"].filter(user => {
    if (name && job) {
      return user.name === name && user.job === job;
    } else if (name) {
      return user.name === name;
    } else if (job) {
      return user.job === job;
    } else {
      return true;
    }
  });
};






app.get("/users", (req, res) => {
  const name = req.query.name; 
  if (name !== undefined) {
    let result = findUserByName(name);
    result = { users_list: result }; 
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id; // get the ID from the URL
  const result = findUserById(id);

  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body; 
  addUser(userToAdd);
  res.status(200).send();
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const deleted = deleteUserById(id);
  if (deleted) {
    res.status(200).send(`User with ID ${id} deleted.`);
  } else {
    res.status(404).send("User not found.");
  }
});

app.get("/users/filter", (req, res) => {
  const { name, job } = req.query;

  if (!name && !job) {
    return res.status(400).send("Please provide a name, a job, or both.");
  }

  const result = users["users_list"].filter(user => {
    return (name ? user.name === name : true) && (job ? user.job === job : true);
  });

  res.send({ users_list: result });
});







