import {describe, it, expect, beforeAll} from 'vitest';
import {
  getUserById,
  getMatchById,
  getMatchesForUser,
  getTask,
  getTasksForUserMatch
} from './database.js';

const TEST_USER_ID = 'your-test-user-id';
const TEST_MATCH_ID = 'your-test-match-id';
const TEST_LOCATION = 'location1';

describe('Database functions', () => {
  it('getUserById returns a user object', async () => {
    const user = await getUserById(TEST_USER_ID);
    expect(user).toBeDefined();
    expect(user.id).toBe(TEST_USER_ID);
  });

  it('getMatchById returns a match object', async () => {
    const match = await getMatchById(TEST_MATCH_ID);
    expect(match).toBeDefined();
    expect(match.id).toBe(TEST_MATCH_ID);
  });

  it('getMatchesForUser returns a list', async () => {
    const matches = await getMatchesForUser(TEST_USER_ID);
    expect(Array.isArray(matches)).toBe(true);
  });

  it('getTask returns a task object', async () => {
    const task = await getTask(TEST_USER_ID, TEST_MATCH_ID, TEST_LOCATION);
    expect(task).toBeDefined();
    expect(task.location).toBe(TEST_LOCATION);
  });

  it('getTasksForUserMatch returns a list of tasks', async () => {
    const tasks = await getTasksForUserMatch(TEST_USER_ID, TEST_MATCH_ID);
    expect(Array.isArray(tasks)).toBe(true);
  });
});
