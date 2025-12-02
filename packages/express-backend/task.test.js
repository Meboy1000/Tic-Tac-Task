import {expect} from "@jest/globals";
import {
  getTask,
  getTasksForUserMatch,
  addTask,
  markTaskComplete,
  deleteTask
} from "./task.js";

import supabase from "./supabaseClient.js";

// Mock supabase RPC for calls
jest.mock("./supabaseClient.js", () => ({
  rpc: jest.fn()
}));

// Gets rid of console logs for errors in output
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Task tests", () => {
  // getTask
  describe("getTask", () => {
    it("returns a single task not list", async () => {
      const returned = { 
        user_id: 352,
        match_id: 67,
        location: 1,
        description: "hello",
        time_to_do: 5
      };
      supabase.rpc.mockResolvedValue({
        data: [returned],
        error: null
      });
      const res = await getTask(352, 67, 1);
      expect(res).toEqual(returned);
      expect(supabase.rpc).toHaveBeenCalledWith("get_task", {
        _user_id: 352,
        _match_id: 67,
        _location: 1
      });
    });

    it("returns null when data empty", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: [], 
        error: null 
      });
      const res = await getTask(352, 67, 1);
      expect(res).toBeNull();
    });

    it("returns null when data null", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await getTask(352, 67, 1);
      expect(res).toBeNull();
    });

    it("throws error", async () => {
      const err = { 
        message: "no!!" 
      };
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(getTask(352, 67, 1)).rejects.toEqual(err);
    });
  });

  // getTasksForUserMatch
  describe("getTasksForUserMatch", () => {
    it("returns list", async () => {
      const list = [{simplified_task_id: 500}, {simplified_task_id: 502}];
      supabase.rpc.mockResolvedValue({
        data: list,
        error: null
      });
      const res = await getTasksForUserMatch(352, 67);
      expect(res).toEqual(list);
      expect(supabase.rpc).toHaveBeenCalledWith("get_tasks_for_user_match", {
        _user_id: 352,
        _match_id: 67
      });
    });

    it("returns empty list when null", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await getTasksForUserMatch(352, 67);
      expect(res).toEqual([]);
    });

    it("throws error", async () => {
      const err = { 
        message: "no tasks" 
      };
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(getTasksForUserMatch(352, 67)).rejects.toEqual(err);
    });
  });

  // addTask
  describe("addTask", () => {
    it("returns inserted task", async () => {
      const created = { 
        simplified_task_id: 503 
      };
      supabase.rpc.mockResolvedValue({
        data: [created],
        error: null
      });
      const input = {
        user_id: 352,
        match_id: 67,
        location: 9,
        description: "Cool task desc here",
        time_to_do: 24,
        complete: false
      };
      const res = await addTask(input);
      expect(res).toEqual(created);
      expect(supabase.rpc).toHaveBeenCalledWith("add_task", {
        _user_id: 352,
        _match_id: 67,
        _location: 9,
        _description: "Cool task desc here",
        _time_to_do: 24,
        _complete: false
      });
    });

    it("returns null when empty", async () => {
      supabase.rpc.mockResolvedValue({
        data: [], 
        error: null
      });
      const res = await addTask({
        user_id: 352,
        match_id: 67,
        location: 9,
        description: "Cool task desc here",
        time_to_do: 24,
        complete: false
      });
      expect(res).toBeNull();
    });

    it("returns null when null", async () => {
      supabase.rpc.mockResolvedValue({
        data: null, 
        error: null 
      });
      const res = await addTask({
        user_id: 352,
        match_id: 67,
        location: 9,
        description: "Cool task desc here",
        time_to_do: 24,
        complete: false
      });
      expect(res).toBeNull();
    });

    it("throws error", async () => {
      const err = { 
        message: "insert fail" 
      };
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(
        addTask({
          user_id: 352,
          match_id: 67,
          location: 9,
          description: "Cool task desc here",
          time_to_do: 24,
          complete: false
        })
      ).rejects.toEqual(err);
    });
  });

  // markTaskComplete
  describe("markTaskComplete", () => {
    it("returns updated task", async () => {
      const updated = { 
        simplified_task_id: 501, 
        complete: true 
      };
      supabase.rpc.mockResolvedValue({
        data: [updated],
        error: null
      });
      const res = await markTaskComplete(352, 67, 1);
      expect(res).toEqual(updated);
      expect(supabase.rpc).toHaveBeenCalledWith("mark_task_complete", {
        _user_id: 352,
        _match_id: 67,
        _location: 1
      });
    });

    it("returns null when empty", async () => {
      supabase.rpc.mockResolvedValue({
        data: [], 
        error: null 
      });
      const res = await markTaskComplete(352, 67, 1);
      expect(res).toBeNull();
    });

    it("returns null when null", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await markTaskComplete(352, 67, 1);
      expect(res).toBeNull();
    });

    it("throws error", async () => {
      const err = { 
        message: "fail" 
      };
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(markTaskComplete(352, 67, 1)).rejects.toEqual(err);
    });
  });

  // deleteTask
  describe("deleteTask", () => {
    it("returns boolean", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: true, 
        error: null 
      });
      const res = await deleteTask(352, 67, 1);
      expect(res).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith("delete_task", {
        _user_id: 352,
        _match_id: 67,
        _location: 1
      });
    });

    it("throws error", async () => {
      const err = { 
        message: "delete failed" 
      };
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(deleteTask(352, 67, 1)).rejects.toEqual(err);
    });
  });
});
