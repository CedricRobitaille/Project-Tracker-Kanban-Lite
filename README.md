# Project Tracker (Kanban-Lite)
<small>Technical Design Document</small>

> A compact, MEN (MongoDB + Express + Node + EJS) Project Tracker with Boards, Tasks, Attachments, and Session auth. Designed to be finishable as a 1–2 controller capstone but includes an authentication controller and Web API integration points for realistic hiring-relevant scope.


<br>

## Table of Contents

0. [Deployment Stages](#deployment-stages)
1. [Project Overview](#project-overview)
2. [Audience & Use Cases](#audience--use-cases)
3. [High-Level Architecture](#high-level-architecture)
4. [Controllers](#controllers)
5. [Endpoints](#endpoints)
6. [Data Model](#data-model)
7. [Authentication](#authentication)
8. [Roadmap](#roadmap)
9. [Wireframes](#wireframes)
10. [Demo](#demo)



<br>

## 0. Deployment Stages

#### MVP
| MVP                  | Description                                       |
|:---------------------|:--------------------------------------------------|
| Board Management     | Create New Boards                                 |
|                      | Read Boards, display all boards                   |
|                      | Update Boards, change properties/people           |
|                      | Delete Boards, remove from user object            |
| Task Management      | Create New Tasks, assign to people                |
|                      | Read Tasks, display all tasks                     |
|                      | Update Tasks, change subtasks/states              |
|                      | Delete Boards, remove from the board object       |

<br>

#### Level Ups
| Level Ups              | Description                                       |
|:-----------------------|:--------------------------------------------------|
| Landing Page           | A Landing Page for new users                      |
| API                    | Access board/task information from an API Call    |
| Authentication         | Login + Register Pages, Restricted page access    |
| Account Administration | Manage team members, and assign people to tasks   |



<br>

## 1. Project Overview

A lightweight **Kanban-style** project and task tracker for small teams. Users can create boards, add members, create tasks (with attachments), move tasks between columns. The backend is `Node` + `Express` + `MongoDB (Atlas)` with server-rendered `EJS` pages for the public board view and a `JSON API` for the dashboard.

Demonstrates real-world backend skills (`REST API`s, `session auth`, Role-Based Access Control`RBAC`, `file uploads`).



<br>

## 2. Audience & Use Cases

**Primary users**
- Small dev teams
- Agencies (owner, member)

**Core use cases**
- Owner creates a board, invites members (Creates sub-users).
- Members add tasks to columns, assign tasks, edit tasks, upload attachments.
- Tasks moved between columns.
- `API` used by `EJS` frontend.



<br>

## 3. High Level Architecture

```
[Browser + EJS Views]
        ↓
[Express Router + Controllers]
        ↓
[Session Middleware (express-session)]
        ↓
[Mongoose Models → MongoDB Atlas]
        ↓
[File Storage (Local)]
```

Key components
- `Express` app with routers.
- `Controllers`: AuthController, BoardsController, TasksController.
- `Mongoose models` for users, boards, tasks, attachments.
- `Multer` for file handling; upload to cloud (Cloudinary or S3) in production.
- `EJS` templating for server-rendered board view; all features accessible via JSON API.



<br>

## 4. Controllers

| Controllers          | Responsibility                                    |
|:---------------------|:--------------------------------------------------|
| `AuthController`     | Register, Login, Logout, and Session Verification |
| `BoardsController`   | Board CRUD and member management                  |
| `TasksController`    | Task CRUD, attachments                            |



<br>

## 5. Endpoints

#### AuthController
| Method    | Path             | Purpose                                  | Render / Dedirect                 |
| --------- | ---------------- | ---------------------------------------- | --------------------------------- |
| `GET`     | `/auth/login`    | Render login page                        | res.render("/auth/login")         |
| `POST`    | `/auth/login`    | Validate credentials, create session     | res.redirect("/boards")           |
| `GET`     | `/auth/register` | Render registration form                 | res.render("/auth/register")      |
| `POST`    | `/auth/register` | Create user and auto-login               | res.redirect("/")                 |
| `POST`    | `/auth/logout`   | Destroy session and redirect             | res.redirect("/")                 |
| `GET`     | `/auth/:userId`  | Return session user info (for dashboard) | res.render("/")                   |
| `DELETE`  | `/auth/:userId`  | Delete user, and redirect                | res.redirect("/")                 |

<br>

#### BoardsController
| Method   | Path                      | Purpose                          | Render / Dedirect                 |
| -------- | ------------------------- | -------------------------------- | --------------------------------- |
| `POST`   | `/boards`                 | Create new board (auth required) | res.redirect("/boards/:boardId")  |
| `GET`    | `/boards`                 | List user’s boards               | res.render("/boards")             |
| `GET`    | `/boards/:boardId`        | Retrieve board (with columns)    | res.render("/boards/:boardId")    |
| `PUT`    | `/boards/:boardId`        | Update board (title, columns)    | res.redirect("/boards")           |
| `DELETE` | `/boards/:boardId`        | Delete board                     | res.redirect("/boards")           |
| `POST`   | `/boards/:boardId/invite` | Add member to board              | res.redirect("/boards/:boardId")  |

<br>

#### TasksController
| Method   | Path                        | Purpose                 | Render / Dedirect                        |
| -------- | --------------------------- | ----------------------- | ---------------------------------------- |
| `POST`   | `/boards/:boardId`          | Create new task         | res.redirect("/boards/:boardId/:taskId") |
| `GET`    | `/boards/:boardId/:taskId`  | Displays task details   | res.render("/boards/:boardId/:taskId")   |
| `PUT`    | `/boards/:boardId/:taskId`  | Edit or move task       | res.render("/boards/:boardId/:taskId")   |
| `DELETE` | `/boards/:boardId/:taskId`  | Delete task             | res.redirect("/boards/:boardId")         |
| `POST`   | `/boards/:boardId/:taskId`  | Save task details       | res.render("/boards/:boardId/:taskId")   |



<br>

## 6. Data Model (MongoDB)

#### `User` (collection: `users`)
```js
{
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  role: { type: String, enum: ['user','admin'], default: 'user' },
  createdAt: Date
}
```

<br>

#### `Board` (collection: `boards`)
```js
{
  _id: ObjectId,
  title: String,
  ownerId: ObjectId, // ref users
  members: [{ userId: ObjectId, role: 'member'|'editor' }],
  columns: [{ _id: ObjectId, name: String, order: Number }],
  createdAt: Date,
  updatedAt: Date
}
```
Index suggestions: `{ ownerId: 1 }, { "members.userId": 1 }`

<br>

#### `Task` (collection: `tasks`)
```js
{
  _id: ObjectId,
  boardId: ObjectId, // ref boards
  columnId: ObjectId, // column in board
  title: String,
  description: String,
  assigneeId: ObjectId,
  order: Number,
  attachments: [{ url, filename, size, uploadedAt }],
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```
Index suggestions: `{ boardId: 1, columnId: 1, order: 1 }`, text `index` on title and `description` for search.



<br>

## 7. Authentication

#### Stack:
- `express-session`: 
- `bcrrypt`: To Hash passwords
- 

#### Auth Flow:
- **Login**: Create `req.session.userID`
- **Protected Routes**: Use `isAuthenticated` to check session
- **Logout**: `req.sessiom.destroy()` to clear cookie
- **Session Expiry**: After 1 week

#### Middleware Example:
```js
// Adds session cookie to user
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
```

```js
req.session.user = {
  username: userInDatabase.username,
  res.redirect("/");
};
```

```js
// Adds session authentication to `boardsController`
app.use(
  "/boards",
  (req, res, next) => {
    if (req.session.user) {
      res.locals.user = req.session.user; // Store user info for use in the next function
      next(); // Proceed to the next middleware or controller
    } else {
      res.redirect("/login"); // Redirect unauthenticated users
    }
  },
  boardsController // The controller handling the '/boards' route
);
```



<br>

## 8. Roadmap

| Day | Task                                        |
| --- | ------------------------------------------- |
| 1   | Setup project, Mongo connection, user model |
| 1   | Session-based auth & routes                 |
| 2   | BoardsController                            |
| 3   | TasksController                             |
| 4   | File uploads                                |
| 5   | Testing setup                               |
| 5   | Deploy + polish README                      |




<br>

## 9. Wireframes

#### Landing Page
<img src="https://i.imgur.com/z97B7Z2.png" width="300">

#### Auth Page
<img src="https://i.imgur.com/RvL8Bue.png" width="300">

#### Board Management
<img src="https://i.imgur.com/ymOJ8je.png" width="300">

#### Board Inner
<img src="https://i.imgur.com/GIKvJks.png" width="300">

#### Task
<img src="https://i.imgur.com/7UZslIR.png" width="300">




<br>

## 10. Demo

1. Login/Register: Demonstrate session-based login and cookie creation.
2. Create Board: Show /api/boards route and redirect to board view.
3. Add Tasks: Create and move tasks between columns.
4. Upload Attachment: Upload file to a task.
5. Logout: Session destroyed, user redirected to /login.

---

> Created by [Cedric Robitaille](https://cedricrobitaille.ca)
