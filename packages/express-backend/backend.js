import 'dotenv/config';
import express from "express";
import cors from "cors";
import {
  getAllUsers,
  getUserById,
  addUser,
  deleteUserById
} from "./user.js";
import {
  getMatchById,
  getMatchesForUser,
  addMatch,
  addUser2ToMatch,
  markMatchComplete,
  deleteMatchById
} from "./match.js";
import {
  getTask,
  getTasksForUserMatch,
  addTask,
  markTaskComplete,
  deleteTask
} from "./task.js";
import {
    registerUser,
    loginUser
} from "./auth.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, can anyone hear me?");
});

// Game state polling endpoint
app.get("/poll-game-state", async (req, res) => {
  try {
    const { matchId, user1Id, user2Id } = req.query;

    if (!matchId || !user1Id) {
      return res.status(400).send("matchId and user1Id are required");
    }

    // Fetch the match details
    const match = await getMatchById(Number(matchId));

    if (!match) {
      return res.status(404).send("Match not found");
    }

    // Fetch tasks for both users
    const user1Tasks = await getTasksForUserMatch(Number(user1Id), Number(matchId));

    let user2Tasks = [];
    if (user2Id) {
      user2Tasks = await getTasksForUserMatch(Number(user2Id), Number(matchId));
    }
    else if (match.user2_id) {
      user2Tasks = await getTasksForUserMatch(Number(match.user2_id), Number(matchId));
    }

    res.json({
      success: true,
      match,
      tasks: {
        user1: user1Tasks,
        user2: user2Tasks
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error in polling game state");
  }
});

app.post("/signup", registerUser);

app.post("/login", loginUser);

// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const users_list = await getAllUsers();
    res.send({ users_list });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
});

// Fetch user with an id
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await getUserById(id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
});

// Create user with an id
app.post("/users", async (req, res) => {
  const user = req.body;
  try {
    const savedUser = await addUser(user);
    res.status(201).send(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving user");
  }
});

// Delete user with an id
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await deleteUserById(id);
    if (!deleted) return res.status(404).send("User not found.");
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get match by ID
app.get("/matches/:id", async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await getMatchById(matchId);
    if (!match) {
      return res.status(404).send("Match not found");
    }
    res.send(match);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching match");
  }
});

// Get matches for user
app.get("/matches/user/:userId", async (req, res) => {
  try {
    const matches = await getMatchesForUser(req.params.userId);
    res.send({ matches });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching matches");
  }
});

// Create match
app.post("/matches", async (req, res) => {
  try {
    const match = await addMatch(req.body);
    res.status(201).send(match);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating match");
  }
});

// Add user2 to match
app.patch("/matches/:id/addUser2", async (req, res) => {
  try {
    const match = await addUser2ToMatch(req.params.id, req.body.user2_id);
    if (!match) return res.status(404).send("Match not found");
    res.send(match);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating match");
  }
});

// Toggle complete on a match
app.patch("/matches/:id/complete", async (req, res) => {
  const matchId = req.params.id;
  try {
    const match = await markMatchComplete(Number(matchId));
    if (!match) return res.status(404).send("Match not found");
    res.send(match);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error marking match complete");
  }
});

// Delete match
app.delete("/matches/:id", async (req, res) => {
  try {
    const deleted = await deleteMatchById(req.params.id);
    if (!deleted) return res.status(404).send("Match not found");
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting match");
  }
});

// Get (singular) task by user, match, and location
app.get("/tasks/:userId/:matchId/:location", async (req, res) => {
  const { userId, matchId, location } = req.params;
  try {
    const task = await getTask(Number(userId), Number(matchId), Number(location));
    if (!task) return res.status(404).send("Task not found");
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching task");
  }
});

// Get all tasks for a user and match
app.get("/tasks/user/:userId/match/:matchId", async (req, res) => {
  const { userId, matchId } = req.params;
  try {
    const tasks = await getTasksForUserMatch(Number(userId), Number(matchId));
    res.send({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tasks");
  }
});

// Create a new task
app.post("/tasks", async (req, res) => {
  try {
    const task = await addTask(req.body);
    res.status(201).send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating task");
  }
});

// Toggle complete on a task
app.patch("/tasks/:userId/:matchId/:location/complete", async (req, res) => {
  const { userId, matchId, location } = req.params;
  try {
    const task = await markTaskComplete(Number(userId), Number(matchId), Number(location));
    if (!task) return res.status(404).send("Task not found");
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error marking task complete");
  }
});

// Delete task
app.delete("/tasks/:userId/:matchId/:location", async (req, res) => {
  const { userId, matchId, location } = req.params;
  try {
    const deleted = await deleteTask(Number(userId), Number(matchId), Number(location));
    if (!deleted) return res.status(404).send("Task not found");
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting task");
  }
});

export default app;