import BASE_URL from "../api/api";

export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
}

export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export async function addUser(user) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Error saving user");
  return res.json();
}

export async function deleteUserById(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("User not found");
  return true;
}
