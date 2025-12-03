import BASE_URL from "../api/api";

export async function getMatchById(id: string) {
  const res = await fetch(`${BASE_URL}/matches/${id}`);
  if (!res.ok) throw new Error("Match not found");
  return res.json();
}

export async function getMatchesForUser(userId: string) {
  const res = await fetch(`${BASE_URL}/matches/user/${userId}`);
  return res.json();
}

export async function addMatch(match: any) {
  const res = await fetch(`${BASE_URL}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match),
  });
  if (!res.ok) throw new Error("Error creating match");
  return res.json();
}

export async function addUser2ToMatch(matchId: string, user2Id: string) {
  const res = await fetch(`${BASE_URL}/matches/${matchId}/addUser2`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user2_id: user2Id }),
  });
  if (!res.ok) throw new Error("Match not found");
  return res.json();
}

export async function markMatchComplete(matchId: string) {
  const res = await fetch(`${BASE_URL}/matches/${matchId}/complete`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Match not found");
  return res.json();
}

export async function deleteMatchById(matchId: string) {
  const res = await fetch(`${BASE_URL}/matches/${matchId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Match not found");
  return true;
}