# cookie session management

## overview
the app uses browser cookies to keep you logged in across refreshes and restarts

## what gets stored in cookies

when you log in or join a game these are saved

- **userId** the database user id
- **username** your username
- **matchId** the room id
- **playerId** player 1 or player 2

## cookie expiration
cookies expire after 7 days by default you can change this in `src/utils/cookies.js`

## files

### new files

#### `src/utils/cookies.js`
contains the cookie helpers
- `setCookie(name, value, days)` store a value
- `getCookie(name)` get a value
- `deleteCookie(name)` remove a cookie
- `saveUserSession(userData)` save the whole session
- `getUserSession()` get the whole session
- `clearUserSession()` clear all session cookies
- `hasActiveSession()` check if a session exists

### modified files

#### `src/App.jsx`
- added a check for an existing session on mount
- `handleLogin` saves the session to cookies
- `handleLogout` clears cookies
- restores user state from cookies automatically

## how it works

### on login create game or join game
1. enter your info then click create game or join game
2. frontend calls the backend
3. backend returns user and match
4. `handleLogin()` runs with this data
5. session is saved to cookies
6. you see the game board

### on page refresh
1. the app mounts
2. it calls `getUserSession()`
3. if cookies exist your session is restored
4. you are logged back in
5. the board loads your session

### on logout
1. click logout
2. `handleLogout()` runs
3. cookies are cleared
4. app state resets
5. you return to the landing page

## testing the cookie system

### test 1 basic login persistence
1. Start backend and frontend
2. Create a game (note the Room ID)
3. Enter tasks and submit
4. refresh the page
5. You should still be logged in with your tasks visible

### test 2 close the tab
1. Login and enter tasks
2. Close the browser tab completely
3. Reopen the frontend URL in a new tab
4. You should still be logged in

### test 3 logout clears session
1. Login to a game
2. Click "Logout"
3. Refresh the page
4. You should be back at the landing page (not auto-logged in)

### test 4 multiple users on same browser
1. Login as Player 1 in a normal window
2. Open an **incognito/private window**
3. Join the same game as Player 2
4. Both sessions should work independently
5. Refresh both windows
6. Both should maintain their respective sessions

## cookie storage details

Cookies are stored in the browser's cookie storage:
- **path** `/`
- **expires** 7 days
- **format** json string
- **location** browser cookies

## viewing cookies in the browser

### chrome or edge devtools
1. Right-click page > "Inspect"
2. Go to "Application" tab
3. Expand "Cookies" in sidebar
4. Click on your localhost URL
5. See all stored cookies

### firefox devtools
1. Right-click page > "Inspect"
2. Go to "Storage" tab
3. Expand "Cookies"
4. Click on your localhost URL

## security notes

### current setup
- cookies are plain text not encrypted
- no httponly flag accessible in javascript
- no secure flag ok for http
- good for development only

### for production
consider
1. httponly cookies set by backend
2. secure flag https only
3. samesite attribute
4. encrypt sensitive data
5. jwt based auth

## troubleshooting

### session not restoring after refresh
- check devtools application cookies
- make sure userId username matchId playerId exist
- check for the console log restored session from cookies

### cookies not being set
- make sure login is successful check network tab
- verify `saveUserSession()` is called
- check if cookies are blocked

### old session persists after logout
- clear cookies in devtools
- hard refresh
- try incognito mode

### multiple users on same browser conflict
- use incognito for the second user
- or use a different browser
- cookies are shared across tabs

## future ideas

1. token refresh auto renew before expiry
2. remember me option with 30 days
3. session validation with backend on restore
4. encrypted storage for sensitive data
5. activity timeout auto logout after inactivity
