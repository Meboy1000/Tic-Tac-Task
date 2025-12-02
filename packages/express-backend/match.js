import supabase from './supabaseClient.js';

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

// Create a new match (user2_id is default null)
export async function addMatch({ user1_id, password }) {
  const { data, error } = await supabase.rpc('add_match', { _user1_id: user1_id, _password: password });
  if (error) {
    console.error('Error creating match:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Add user2_id to match
export async function addUser2ToMatch(matchId, user2_id) {
  const { data, error } = await supabase.rpc('add_user2_to_match', { _match_id: matchId, _user2_id: user2_id });
  if (error) {
    console.error('Error adding user2 to match:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Mark match as complete
export async function markMatchComplete(matchId) {
  const { data, error } = await supabase.rpc('mark_match_complete', { _match_id: matchId });
  if (error) {
    console.error('Error marking match complete:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Delete a match by ID
export async function deleteMatchById(matchId) {
  const { data, error } = await supabase.rpc('delete_match_by_id', { _match_id: matchId });
  if (error) {
    console.error('Error deleting match:', error.message);
    throw error;
  }
  return data;
}