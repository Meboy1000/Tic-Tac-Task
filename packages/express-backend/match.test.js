import {expect} from "@jest/globals";
import {
  getMatchById,
  getMatchesForUser,
  addMatch,
  addUser2ToMatch,
  markMatchComplete,
  deleteMatchById
} from "./match.js";

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

describe("Match tests", () => {
  // getMatchById
  describe("getMatchById", () => {
    it("return match", async () => {
      supabase.rpc.mockResolvedValue({
        data: [{id: 50}],
        error: null
      });
      const res = await getMatchById(50);
      expect(res).toEqual({id: 50});
      expect(supabase.rpc).toHaveBeenCalledWith("get_match_by_id", {match_id: 50});
    });

    it("return null if empty", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: [], 
        error: null 
      });
      const res = await getMatchById(99);
      expect(res).toBeNull();
    });

    it("return null if null", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await getMatchById(99);
      expect(res).toBeNull();
    });

    it("throws error", async () => {
      const err = {message: "you failed!"};
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(getMatchById(352)).rejects.toEqual(err);
    });
  });

  // getMatchesForUser
  describe("getMatchesForUser", () => {
    it("returns list", async () => {
      const matches = [{id: 1}, {id: 2}];
      supabase.rpc.mockResolvedValue({
        data: matches,
        error: null
      });
      const res = await getMatchesForUser(7);
      expect(res).toEqual(matches);
      expect(supabase.rpc).toHaveBeenCalledWith("get_matches_for_user", {_user_id: 7});
    });

    it("returns empty list when null", async () => {
      supabase.rpc.mockResolvedValue({
        data: null, 
        error: null
      });
      const res = await getMatchesForUser(7);
      expect(res).toEqual([]);
    });

    it("throws error", async () => {
      const err = {
        message: "no matches??"
      };
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(getMatchesForUser(7)).rejects.toEqual(err);
    });
  });

  // addMatch
  describe("addMatch", () => {
    it("return match", async () => {
      const match = {
        id: 600
      };
      supabase.rpc.mockResolvedValue({
        data: [match],
        error: null
      });
      const res = await addMatch({
        user1_id: 352, 
        password: "notmymonkeysnotmycircus2"
      });
      expect(res).toEqual(match);
      expect(supabase.rpc).toHaveBeenCalledWith("add_match", {
        _user1_id: 352,
        _password: "notmymonkeysnotmycircus2"
      });
    });

    it("returns null when empty", async () => {
      supabase.rpc.mockResolvedValue({
        data: [], 
        error: null
      });
      const res = await addMatch({
        user1_id: 352, 
        password: "notmymonkeysnotmycircus2"
      });
      expect(res).toBeNull();
    });

    it("returns null when null", async () => {
      supabase.rpc.mockResolvedValue({
        data: null, 
        error: null
      });
      const res = await addMatch({
        user1_id: 352, 
        password: "notmymonkeysnotmycircus2"
      });
      expect(res).toBeNull();
    });

    it("throws on rpc error", async () => {
      const err = {message: "insert failed"};
      supabase.rpc.mockResolvedValue({
        data: null, 
        error: err
      });
      await expect(
        addMatch({
          user1_id: 352, 
          password: "notmymonkeysnotmycircus2"
        })
      ).rejects.toEqual(err);
    });
  });

  // addUser2ToMatch
  describe("addUser2ToMatch", () => {
    it("returns updated match with user2_id", async () => {
      const match = {
        id: 600, 
        user2_id: 67
      };
      supabase.rpc.mockResolvedValue({
        data: [match],
        error: null
      });
      const res = await addUser2ToMatch(600, 67);
      expect(res).toEqual(match);
      expect(supabase.rpc).toHaveBeenCalledWith("add_user2_to_match", {
        _match_id: 600,
        _user2_id: 67
      });
    });

    it("returns null when empty", async () => {
      supabase.rpc.mockResolvedValue({
        data: [], 
        error: null
      });
      const res = await addUser2ToMatch(600, 67);
      expect(res).toBeNull();
    });

    it("returns null when null", async () => {
      supabase.rpc.mockResolvedValue({
        data: null, 
        error: null
      });
      const res = await addUser2ToMatch(600, 67);
      expect(res).toBeNull();
    });

    it("throws error", async () => {
      const err = {message: "match is full!!"};
      supabase.rpc.mockResolvedValue({
        data: null, 
        error: err
      });
      await expect(addUser2ToMatch(600, 67)).rejects.toEqual(err);
    });
  });

  // markMatchComplete
  describe("markMatchComplete", () => {
    it("returns updated data", async () => {
      const updated = { 
        id: 352, 
        complete: true 
      };
      supabase.rpc.mockResolvedValue({
        data: [updated],
        error: null
      });

      const res = await markMatchComplete(352);
      expect(res).toEqual(updated);
      expect(supabase.rpc).toHaveBeenCalledWith("mark_match_complete", {
        _match_id: 352
      });
    });

    it("returns null when empty", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: [], 
        error: null 
      });
      const res = await markMatchComplete(352);
      expect(res).toBeNull();
    });

    it("returns null when null", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await markMatchComplete(352);
      expect(res).toBeNull();
    });

    it("throws error", async () => {
      const err = {message: "mark failed"};
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(markMatchComplete(352)).rejects.toEqual(err);
    });
  });

  // deleteMatchById
  describe("deleteMatchById", () => {
    it("returns boolean", async () => {
      supabase.rpc.mockResolvedValue({ 
        data: true, 
        error: null 
      });
      const res = await deleteMatchById(352);
      expect(res).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith("delete_match_by_id", {
        _match_id: 352
      });
    });

    it("throws error", async () => {
      const err = {message: "delete failed!"};
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(deleteMatchById(352)).rejects.toEqual(err);
    });
  });
});
