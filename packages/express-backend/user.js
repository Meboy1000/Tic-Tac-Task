import supabase from './supabaseClient.js';

// Fetch all users
export async function getAllUsers() {
  const { data, error } = await supabase.rpc('get_all_users');
  if (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
  // Returns list either way
  return data || [];
}

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

// find user by username, used for login
export async function getUserByName(name) {
    const {data, error} = await supabase.rpc('get_user_by_name', {user_name: name});
    if (error) {
        console.error('Error fetching user:', error.message);
        throw error;
    }
    return data?.[0] || null;
}

// Add new user
export async function addUser({ username, password }) {
  const { data, error } = await supabase.rpc('add_user', {
    new_username: username,
    new_password: password
  });
  if (error) {
    console.error('Error adding user:', error.message);
    throw error;
  }
  return data?.[0] || null;
}

// Delete user by id
export async function deleteUserById(id) {
  const { data, error } = await supabase.rpc('delete_user_by_id', { user_id: id });
  if (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
  // Boolean on whether it deleted something or not
  return data;
}
