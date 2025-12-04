
//set a cookie with name value and optional expiration days
 
export function setCookie(name, value, days = 7) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
}

//get a cookie value by name
export function getCookie(name) {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      const value = cookie.substring(nameEQ.length);
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
  }
  return null;
}

//delete a cookie by name
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

//save user session to cookies
export function saveUserSession(userData) {
  setCookie('userId', userData.userId, 7);
  setCookie('username', userData.username, 7);
  setCookie('matchId', userData.matchId, 7);
  setCookie('playerId', userData.playerId, 7);
  console.log('User session saved to cookies:', userData);
}

//get user session from cookies
export function getUserSession() {
  const userId = getCookie('userId');
  const username = getCookie('username');
  const matchId = getCookie('matchId');
  const playerId = getCookie('playerId');
  
  // only return session if all required fields exist
  if (userId && username && matchId && playerId) {
    return { userId, username, matchId, playerId };
  }
  return null;
}

//clear user session from cookies
export function clearUserSession() {
  deleteCookie('userId');
  deleteCookie('username');
  deleteCookie('matchId');
  deleteCookie('playerId');
  console.log('User session cleared from cookies');
}

//check if user has an active session
export function hasActiveSession() {
  return getUserSession() !== null;
}
