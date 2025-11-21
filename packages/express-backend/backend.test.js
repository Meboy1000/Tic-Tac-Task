import request from "supertest";
import app from "./backend.js";

// Mock all backend function files - this basically assumes that those work (proven by other test.js files)
jest.mock("./user.js", () => ({
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  addUser: jest.fn(),
  deleteUserById: jest.fn(),
}));

jest.mock("./match.js", () => ({
  getMatchById: jest.fn(),
  getMatchesForUser: jest.fn(),
  addMatch: jest.fn(),
  addUser2ToMatch: jest.fn(),
  markMatchComplete: jest.fn(),
  deleteMatchById: jest.fn(),
}));

jest.mock("./task.js", () => ({
  getTask: jest.fn(),
  getTasksForUserMatch: jest.fn(),
  addTask: jest.fn(),
  markTaskComplete: jest.fn(),
  deleteTask: jest.fn(),
}));

// Import mocked functions for use in tests
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

// Gets rid of console logs for errors in output
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

// User Methods
describe("GET /users", () => {
  test("returns list of users", async () => {
    getAllUsers.mockResolvedValue([{ 
      id: 9999, 
      name: "LEBUBU" 
    }]);
    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body.users_list).toEqual([{ 
      id: 9999, 
      name: "LEBUBU" 
    }]);
  });

  test("returns 500 on error", async () => {
    getAllUsers.mockRejectedValue(new Error("DB error"));
    const res = await request(app).get("/users");
    expect(res.status).toBe(500);
  });
});

describe("GET /users/:id", () => {
  test("returns user", async () => {
    getUserById.mockResolvedValue({ 
      id: 9999, 
      name: "LEBUBU" 
    });
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ 
      id: 9999, 
      name: "LEBUBU" 
    });
  });

  test("returns 404 when not found", async () => {
    getUserById.mockResolvedValue(null);
    const res = await request(app).get("/users/1");
    expect(res.status).toBe(404);
  });
});

describe("POST /users", () => {
  test("creates user", async () => {
    addUser.mockResolvedValue({ 
      id: 10000, 
      name: "AAAAAAAAAAA" 
    });
    const res = await request(app)
      .post("/users")
      .send({ 
        username: "AAAAAAAAAAA", 
        password: "password1234" 
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ 
			id: 10000, 
			name: "AAAAAAAAAAA" 
		});
  });
});

describe("DELETE /users/:id", () => {
  test("deletes user", async () => {
    deleteUserById.mockResolvedValue(true);
    const res = await request(app).delete("/users/10000");
    expect(res.status).toBe(204);
  });

  test("returns 404 if not found", async () => {
    deleteUserById.mockResolvedValue(false);
    const res = await request(app).delete("/users/10000");
    expect(res.status).toBe(404);
  });
});

// Matches
describe("GET /matches/:id", () => {
  test("returns match", async () => {
    getMatchById.mockResolvedValue({id: 67});
    const res = await request(app).get("/matches/67");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({id: 67});
  });

  test("returns 404 when not found", async () => {
    getMatchById.mockResolvedValue(null);
    const res = await request(app).get("/matches/67");
    expect(res.status).toBe(404);
  });
});

describe("GET /matches/user/:userId", () => {
  test("returns matches", async () => {
    getMatchesForUser.mockResolvedValue([{id: 9999}]);
    const res = await request(app).get("/matches/user/9999");
    expect(res.status).toBe(200);
    expect(res.body.matches).toEqual([{id: 9999}]);
  });
});

describe("POST /matches", () => {
  test("creates match", async () => {
    addMatch.mockResolvedValue({id: 68});
    const res = await request(app).post("/matches").send({user1_id: 9999});
    expect(res.status).toBe(201);
    expect(res.body).toEqual({id: 68});
  });
});

describe("PATCH /matches/:id/addUser2", () => {
  test("adds user2", async () => {
    addUser2ToMatch.mockResolvedValue({
			id: 50, 
			user2_id: 9999
		});
    const res = await request(app)
      .patch("/matches/50/addUser2")
      .send({user2_id: 9999});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({id: 50, user2_id: 9999});
  });

  test("returns 404", async () => {
    addUser2ToMatch.mockResolvedValue(null);
    const res = await request(app)
      .patch("/matches/50/addUser2")
      .send({user2_id: 9999});
    expect(res.status).toBe(404);
  });
});

describe("PATCH /matches/:id/complete", () => {
  test("marks complete", async () => {
    markMatchComplete.mockResolvedValue({ 
			id: 50, 
			complete: true 
		});
    const res = await request(app).patch("/matches/50/complete");
    expect(res.status).toBe(200);
    expect(res.body.complete).toBe(true);
  });
});

describe("DELETE /matches/:id", () => {
  test("deletes match", async () => {
    deleteMatchById.mockResolvedValue(true);
    const res = await request(app).delete("/matches/50");
    expect(res.status).toBe(204);
  });
});

// Tasckes
describe("GET /tasks/:userId/:matchId/:loc", () => {
  test("returns task", async () => {
    getTask.mockResolvedValue({location: 9});
    const res = await request(app).get("/tasks/9999/67/9");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({location: 9});
  });
});

describe("GET /tasks/user/:userId/match/:matchId", () => {
  test("returns tasks", async () => {
    getTasksForUserMatch.mockResolvedValue([{location: 2}]);
    const res = await request(app).get("/tasks/user/9999/match/67");
    expect(res.status).toBe(200);
    expect(res.body.tasks).toEqual([{location: 2}]);
  });
});

describe("POST /tasks", () => {
  test("creates task", async () => {
    addTask.mockResolvedValue({simplified_task_id: 1});
    const res = await request(app)
      .post("/tasks")
      .send({ 
				user_id: 9999, 
				match_id: 67, 
				location: 6 
			});
    expect(res.status).toBe(201);
    expect(res.body).toEqual({simplified_task_id: 1});
  });
});

describe("PATCH /tasks/:u/:m/:l/complete", () => {
  test("marks complete", async () => {
    markTaskComplete.mockResolvedValue({complete: true});
    const res = await request(app).patch("/tasks/9999/67/6/complete");
    expect(res.status).toBe(200);
    expect(res.body.complete).toBe(true);
  });
});

describe("DELETE /tasks/:u/:m/:l", () => {
  test("deletes task", async () => {
    deleteTask.mockResolvedValue(true);
    const res = await request(app).delete("/tasks/9999/67/6");
    expect(res.status).toBe(204);
  });
});
