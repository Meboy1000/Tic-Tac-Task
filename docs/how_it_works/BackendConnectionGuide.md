# how to test the frontend backend connection

## what i connected

### 1. landing page (login signup)
- when you click create game it
  - makes a new user in the db
  - makes a new match
  - logs you in as player 1
  - shows the room id

- when you click join game it
  - makes a new user in the db
  - finds the match by room id
  - adds you as player 2
  - logs you in as player 2

### 2. game board tasks
- when the board loads it fetches tasks from the db
- if you already submitted tasks it shows them

- when you click submit tasks it
  - saves all 9 tasks to the db
  - ties them to your user id match id and location 0 to 8
  - saves the task name and time estimate

## how to test

### step 1 start the backend
```powershell
cd C:\TikTakTask\Tic-Tac-Task\packages\express-backend
npm run dev
```
you should see `REST API is listening.`

### step 2 start the frontend in a new terminal
```powershell
cd C:\TikTakTask\Tic-Tac-Task\packages\react-frontend
npm run dev
```
you should see a url like `http://localhost:5173`

### step 3 test creating a game
1. open the frontend url in your browser
2. enter a username and password like player1 and pass123
3. click create game
4. you should see an alert with a room id like 1 or 2
5. enter your 9 tasks with time estimates
6. click submit tasks
7. check the backend terminal you should see logs

### step 4 test joining a game
1. open the frontend in a new incognito window or another browser
2. enter a different username and password like player2 and pass456
3. click join game
4. enter the room id from step 3
5. click join game in the popup
6. you should join the same game as player 2

### step 5 verify database connection
check the backend terminal for logs
- user creation
- match creation
- task creation

## what gets saved

### users table
- id
- username
- password hashed

### matches table
- id room id
- user1_id player 1
- user2_id player 2
- complete true or false

### tasks table
- user_id
- match_id
- location 0 to 8
- description
- time_to_do minutes
- complete true or false

## troubleshooting

### error creating game
- check the backend is running on port 8000
- check the browser console for errors
- make sure supabase is configured

### error saving tasks
- check you are logged in with userId and matchId
- check backend terminal for errors
- verify the backend /tasks post endpoint works

### cors errors
- make sure the backend has app.use(cors())
- check that BASE_URL in api.jsx is http://localhost:8000

## next steps optional

1. load both players tasks
2. real time updates with websockets or polling
3. mark tasks complete with markTaskComplete
4. better auth with jwt and login
5. better error messages and validation
