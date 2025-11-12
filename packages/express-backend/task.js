import supabase from './supabaseClient.js';

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
  return data || [];
}

// Add a new task
export async function addTask({ user_id, match_id, location, description, time_to_do, complete = false }) {
  const { data, error } = await supabase.rpc('add_task', {
    _user_id: user_id,
    _match_id: match_id,
    _location: location,
    _description: description,
    _time_to_do: time_to_do,
    _complete: complete,
  });
  if (error) {
    console.error('Error adding task:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Mark task as complete
export async function markTaskComplete(user_id, match_id, location) {
  const { data, error } = await supabase.rpc('mark_task_complete', {
    _user_id: user_id,
    _match_id: match_id,
    _location: location
  });
  if (error) {
    console.error('Error marking task complete:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Delete a task
export async function deleteTask(user_id, match_id, location) {
  const { data, error } = await supabase.rpc('delete_task', {
    _user_id: user_id,
    _match_id: match_id,
    _location: location,
  });
  if (error) {
    console.error('Error deleting task:', error.message);
    throw error;
  }
  return data;
}
