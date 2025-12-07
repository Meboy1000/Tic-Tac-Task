# Simple Guide: Tasks and (optional) X/O marks

## 1) Database (Supabase)

Right now, X/O marks are local only. You don’t need any DB change for marks.
Tasks already work with the current setup.

## 2) Backend (Express)

No marks endpoints right now.
Task routes and functions stay the same and work:

- `packages/express-backend/backend.js` has routes for create, fetch, delete, complete.
- `packages/express-backend/task.js` has the logic.

## 3) Frontend (React)

Marks are local only:

- File: `packages/react-frontend/src/pages/Game/GameBoardL.jsx`
	- Marks live in state and clear locally.
	- Tasks (add, list, delete, clear-all) still poll every 3s.

## 4) Check it works

1. Run the SQL to add the `marks` column.
2. Reset Supabase API schema cache.
3. Restart backend.
4. Start dev environment:
	 ```powershell
	 cd "C:\TikTakTask\Tic-Tac-Task"; npm run dev
	 ```
5. Create or join a match; click cells (X/O is local).
6. Add tasks; both players should see them in ~3s.
7. Use delete buttons and “Clear All My Tasks”; tasks should be removed.

---

## Later: turn on shared X/O marks

When you want both players to share marks:

1) Add a `marks` column to `matches` and refresh the API cache.

```sql
ALTER TABLE matches 
ADD COLUMN marks JSONB DEFAULT '[0,0,0,0,0,0,0,0,0]'::jsonb;
```

2) Re-enable the marks API and calls (I can help wire this back in fast).

## 5) Troubleshooting

- Error: `column matches.marks does not exist`
	- Cause: DB column not added yet.
	- Fix: Run the SQL and reset API cache; restart backend.

- Error: `Could not find the 'marks' column of 'matches' in the schema cache`
	- Cause: PostgREST cache hasn’t updated.
	- Fix: Reset API cache in Supabase; restart backend.

- Infinite error loop
	- Mitigation: `marksEnabled` disables marks polling/saving until the column exists.

## 6) Behavior Summary

- `marks` JSONB array length 9: positions 0–8.
- Values: 0 = empty, 1 = Player 1 (X), 2 = Player 2 (O).
- Frontend polls marks every 3 seconds when enabled.
- Optimistic UI updates, then backend save; clear button resets DB + UI.

