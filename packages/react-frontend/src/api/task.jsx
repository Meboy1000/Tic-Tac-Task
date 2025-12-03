import BASE_URL from "../api/api";

export async function getTask(userId, matchId, location) {
  const res = await fetch(`${BASE_URL}/tasks/${userId}/${matchId}/${location}`);
  if (!res.ok) throw new Error("Task not found");
  return res.json();
}

export async function getTasksForUserMatch(userId, matchId) {
  const res = await fetch(`${BASE_URL}/tasks/user/${userId}/match/${matchId}`);
  return res.json();
}

export async function addTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Error creating task");
  return res.json();
}

export async function markTaskComplete(userId, matchId, location) {
  const res = await fetch(`${BASE_URL}/tasks/${userId}/${matchId}/${location}/complete`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Task not found");
  return res.json();
}

export async function deleteTask(userId, matchId, location) {
  const res = await fetch(`${BASE_URL}/tasks/${userId}/${matchId}/${location}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Task not found");
  return true;
}
