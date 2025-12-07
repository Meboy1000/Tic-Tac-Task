# Project Documentation

## Project Description

Our project features a tic-tac-toe board that can host two different players that can play and receive updates simultaneously. Additionally, they can input descriptions and times for tasks that are assigned to the various spaces on the game board, facilitating a bingo-like, productivity-boosting game where users would compete by trying to fill squares by marking tasks off of this to-do list. Our project contains additional features such as:
 - A landing page allowing users to sign up and create or join game rooms
 - Aesthetic/game components, such as UI dark mode
 - Cookies

## UI Prototype (Figma)

https://www.figma.com/design/qZQaWqfVrtTqMVQ5wMv03T/Frontend-UX?node-id=1-2&t=vvUeauhNY6Xsi5pQ-1
Should be read and comment-only if not authorized. 
Last updated Nov. 13

## Development Environment Setup

### Prerequisites:

Node.js
Git

### Dependencies:

From the root:
npm install
This'll automatically install packages for:
packages/express-backend
packages/react-frontend
Workspaces depend on root installs. Don't run npm install in the other folders, please!

### Environment Variables:

All of the environment variables are stored in supabase (our DB) or Azure (Cloud). You don't need to configure any.

### Running the Development Environment

Call from the root:
npm run dev
This runs both the frontend and backend concurrently. The package.json files include more commands, including running either frontend or backend individually.

### Backend Testing:

Go into the backend folder:
cd packages/express-backend
npm test

### Frontend Testing:

None configured yet.

### Linting & Formatting Check

To check linter and formatting run from root: 
npm run lint
This runs ESLint + Prettier across the whole repo.

To format all files using prettier:
npm run format

### Database Setup (Supabase)

This project uses Supabase, hosted remotely.
No local database setup is required.

You need to request for Supabase access, though.

### General Rules For Contributing (This is what you remember!)

- Pascal Casing

- 4 Whitespace Indent

- Indent after a curly brace (Function Definition, Curly Brace, Newline, Function Body)

- Use Prettier

## UML Class Diagram

Check the UML Class Diagram in [docs/diagrams/UmlClassDiagram.md](docs/diagrams/UmlClassDiagram.md)

## Access Control Diagram

<img width="5410" height="2652" alt="AccessControlDiagrams" src="https://github.com/user-attachments/assets/d14dadd5-ebea-4702-814c-5e472b1ddfec" />

