import {expect} from "@jest/globals";
import {
  getAllUsers,
  getUserById,
  findUserByName,
  addUser,
  deleteUserById
} from './user.js';

import supabase from './supabaseClient.js';

// Mock supabase RPC for calls
jest.mock('./supabaseClient.js', () => ({
  rpc: jest.fn()
}));

// Gets rid of console logs for errors in output
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('User tests', () => {
  // getAllUsers
  describe('getAllUsers', () => {
    it('returns user list when rpc succeeds', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: [{id: 352}], 
        error: null 
      });
      const res = await getAllUsers();
      expect(res).toEqual([{id: 352}]);
      expect(supabase.rpc).toHaveBeenCalledWith('get_all_users');
    });

    it('returns empty array when data is null', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await getAllUsers();
      expect(res).toEqual([]);
    });

    it('throws error on rpc failure', async () => {
      const err = {message: 'DB Failure'};
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(getAllUsers()).rejects.toEqual(err);
    });
  });

  //getUserById
  describe('getUserById', () => {
    it('returns single user when data has row', async () => {
      supabase.rpc.mockResolvedValue({
        data: [{id: 352}],
        error: null
      });
      const res = await getUserById(352);
      expect(res).toEqual({id: 352});
      expect(supabase.rpc).toHaveBeenCalledWith('get_user_by_id', {user_id: 352});
    });

    it('returns null when data empty', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: [], 
        error: null 
      });
      const res = await getUserById(352);
      expect(res).toBeNull();
    });

    it('returns null when data null', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await getUserById(352);
      expect(res).toBeNull();
    });

    it('throws error', async () => {
      const err = { message: 'Error' };
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(getUserById(352)).rejects.toEqual(err);
    });
});

  //findUserByName
  describe('findUserByName', () => {
    it('returns user when found', async () => {
      supabase.rpc.mockResolvedValue({
        data: [{id: 50, name: 'mickey'}],
        error: null
      });
      const res = await findUserByName('mickey');
      expect(res).toEqual({ 
        id: 50, 
        name: 'mickey' 
      });
      expect(supabase.rpc).toHaveBeenCalledWith('get_user_by_name', {user_name: 'mickey'});
    });

    it('returns null if not', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: [], 
        error: null 
      });
      const res = await findUserByName('kevin');
      expect(res).toBeNull();
    });

    it('returns null', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await findUserByName('kevin');
      expect(res).toBeNull();
    });

    it('throws on rpc error', async () => {
      const err = {message: 'wheres kevin?'};
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(findUserByName('kevin')).rejects.toEqual(err);
    });
  });

  //addUser
  describe('addUser', () => {
    it('insert user returned', async () => {
      const input = { 
        username: 'mackey', 
        password: 'notmymonkeysnotmycircus' 
      };
      const returned = {id: 10000};
      supabase.rpc.mockResolvedValue({
        data: [returned],
        error: null
      });
      const res = await addUser(input);
      expect(res).toEqual(returned);
      expect(supabase.rpc).toHaveBeenCalledWith('add_user', {
        new_username: 'mackey',
        new_password: 'notmymonkeysnotmycircus'
      });
    });

    it('returns null when data empty', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: [], 
        error: null 
      });
      const res = await addUser({ 
        username: 'mackey', 
        password: 'notmymonkeysnotmycircus' 
      });
      expect(res).toBeNull();
    });

    it('returns null when data null', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: null 
      });
      const res = await addUser({ 
        username: 'mackey', 
        password: 'notmymonkeysnotmycircus' 
      });
      expect(res).toBeNull();
    });

    it('throws error', async () => {
      const err = {message: 'you failed!'};
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(
        addUser({ 
          username: 'mackey', 
          password: 'notmymonkeysnotmycircus' 
        })
      ).rejects.toEqual(err);
    });
  });

  //deleteUserById tests
  describe('deleteUserById', () => {
    it('returns boolean', async () => {
      supabase.rpc.mockResolvedValue({ 
        data: true, 
        error: null 
      });
      const res = await deleteUserById(352);
      expect(res).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('delete_user_by_id', {user_id: 352});
    });

    it('throws error', async () => {
      const err = {message: 'you failed to delete mwahaha!'};
      supabase.rpc.mockResolvedValue({ 
        data: null, 
        error: err 
      });
      await expect(deleteUserById(352)).rejects.toEqual(err);
    });
  });
});
