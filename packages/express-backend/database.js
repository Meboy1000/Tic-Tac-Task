import supabase from './supabaseClient.js';

// Fetches user given a user id
export async function getUserById(id) {
  const {data, error} = await supabase.rpc('get_user_by_id', {user_id: id});
  if (error) {
    console.error('Error fetching user:', error.message);
    throw error;
  }
  // Technically gives us a list object (even though it can only have 1 max row), so I make it single result
  return data?.[0] || null;
}

// Fetches a match given a match id, might not be as useful as latter
export async function getMatchById(matchId) {
  const {data, error} = await supabase.rpc('get_match_by_id', {match_id: matchId});
  if (error) {
    console.error('Error fetching match:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Fetch all matches a user participates in
export async function getMatchesForUser(userId) {
  const { data, error } = await supabase.rpc('get_matches_for_user', { _user_id: userId });
  if (error) {
    console.error('Error fetching matches for user:', error.message);
    throw error;
  }
  return data || [];
}

// Fetches only one task by user match and location
export async function getTask(userId, matchId, location) {
  const { data, error } = await supabase.rpc('get_task', {
    _user_id: userId,
    _match_id: matchId,
    _location: location,
  });
  if (error) {
    console.error('Error fetching task:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Fetch all tasks of a given user id and match id
export async function getTasksForUserMatch(userId, matchId) {
  const { data, error } = await supabase.rpc('get_tasks_for_user_match', {
    _user_id: userId,
    _match_id: matchId,
  });
  if (error) {
    console.error('Error fetching tasks:', error.message);
    throw error;
  }
  // Returns a list either way
  return data || [];
}