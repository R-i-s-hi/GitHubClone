<div align="center">

<h1>
  <img src="https://img.shields.io/badge/-GitClone-F05032?style=flat&logo=git&logoColor=white" height="30"/>
</h1>

<p><strong>A full-stack GitHub-inspired platform built with React, Node.js & MongoDB</strong></p>

<p>
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-cli-usage">CLI Usage</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-project-structure">Project Structure</a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS-S3-FF9900?style=flat-square&logo=amazon-aws&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-Enabled-010101?style=flat-square&logo=socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
</p>

</div>

---

## 📖 Overview

**GitClone** is a fully functional, GitHub-inspired version control platform built from scratch. It supports real repository management, a custom CLI for git-like operations, in-browser file editing with commit history, issue tracking, user authentication, and real-time features via Socket.io — all on a responsive UI powered by React and Bootstrap.

> A simplified but real GitHub — where you own and control the entire stack.

---

## ✨ Features

### 🗂️ Repository Management
- Full CRUD on repositories
- Edit file contents directly in the browser and save via commit
- File storage backed by **AWS S3** (via UploadThing)

### 👤 User Accounts
- Full CRUD on user profiles
- Token-based authentication (JWT)

### 🐛 Issue Tracker
- Create, update, close, and delete issues per repository

### ⭐ Social Features
- Star / unstar repositories with live counts

### 💻 Custom CLI (Yargs-powered)

| Command | Description |
|--------|-------------|
| `node app.js init` | Initialize a local `.repoGit` repository |
| `node app.js add <file>` | Stage a file for commit |
| `node app.js commit <msg>` | Commit all staged files with a message |
| `node app.js push <username> <repoName>` | Push committed files to AWS S3 |
| `node app.js pull <repoName>` | Pull latest files from AWS S3 |
| `node app.js revert <commitID> <repoName>` | Revert a repo to a specific commit |

### 🔌 Real-time
- Socket.io integration for live updates (room-based per user ID)

### 📱 Responsive Design
- Fully responsive across all screen sizes using Bootstrap 5

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Bootstrap 5 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **File Storage** | AWS S3 |
| **File Uploads** | UploadThing |
| **Authentication** | JWT (JSON Web Tokens) |
| **Real-time** | Socket.io |
| **CLI** | Yargs |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account and cluster
- An [AWS account](https://aws.amazon.com/) with an S3 bucket
- An [UploadThing](https://uploadthing.com/) account

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gitclone.git
cd gitclone
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gitclone

# JWT
JWT_SECRET=your_super_secret_jwt_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-s3-bucket-name

# UploadThing
UPLOADTHING_SECRET_KEY=your_uploadthing_secret
```

---

### 4. Start the Server

```bash
node app.js start
```

The API will be available at `http://localhost:5000`.

---

### 5. Start the Frontend

```bash
cd client
npm install
npm start
```

The app opens at `http://localhost:3000`.

---

## 💻 CLI Usage

The CLI is powered by [Yargs](https://yargs.js.org/) and shares the same `app.js` entry point as the server. All CLI commands are run as:

```bash
node app.js <command> [arguments]
```

### How It Works Locally

When you run `init`, the CLI creates a `.repoGit/` directory in your current working folder to manage staged files, commits, and history — similar to how `.git/` works in standard git.

```
.repoGit/
├── config.json        # S3 bucket config (set at init)
├── staging/           # Files staged via `add`, cleared after `commit`
├── commits/           # Local commits waiting to be pushed
├── prevCommits/       # Pushed commits (used as source for `revert`)
└── pullCommits/       # History of pull operations
```

---

### `init` — Initialize a Repository

```bash
node app.js init
```

Creates a `.repoGit/` directory in the current folder with a `commits/` subfolder and a `config.json` referencing your S3 bucket. Exits with a warning if the repo is already initialized.

```
Repository initialized successfully.
```

---

### `add <file>` — Stage a File

```bash
node app.js add <file>
```

Copies the specified file into `.repoGit/staging/`. The repository must be initialized first.

**Example:**

```bash
node app.js add index.js
# File index.js added to staging area!
```

---

### `commit <msg>` — Commit Staged Files

```bash
node app.js commit "<message>"
```

Moves all staged files out of `staging/` into a new UUID-named folder inside `commits/`. Generates a `commit.json` with metadata: commit ID, timestamp, message, and file list.

**Example:**

```bash
node app.js commit "add homepage"
# Commit 3f2a1b4c-... created with message: "add homepage"
```

**Generated `commit.json` structure:**

```json
[
  {
    "id": "3f2a1b4c-uuid-v4",
    "operation": "commit",
    "message": "add homepage",
    "updatedAt": "2024-06-01T10:00:00.000Z",
    "OperationFiles": ["index.js", "style.css"]
  }
]
```

---

### `push <username> <repoName>` — Push Commits to S3

```bash
node app.js push <username> <repoName>
```

Verifies that the user and repository exist in the database, then uploads all local commits to S3 under the `<repoName>/` prefix. Commits are sorted by timestamp and pushed in order. Each pushed commit is moved to `prevCommits/` for future revert operations, and the local commit folder is removed.

**Example:**

```bash
node app.js push johndoe my-project
# All commits pushed to S3 successfully.
```

> ⚠️ You must have a registered account on the platform and have created the repository before pushing.

---

### `pull <repoName>` — Pull Files from S3

```bash
node app.js pull <repoName>
```

Lists all objects under `<repoName>/` in S3 and downloads each file into your current working directory (overwriting if they already exist). A new pull entry is appended to the remote `commit.json` on S3, and a local record is saved to `.repoGit/pullCommits/`.

**Example:**

```bash
node app.js pull my-project
# Pulled index.js
# Pulled style.css
```

---

### `revert <commitID> <repoName>` — Revert to a Commit

```bash
node app.js revert <commitID> <repoName>
```

Looks up the specified commit in `prevCommits/`, copies its files back into `commits/` with a `revert` operation entry in `commit.json`, and deletes the corresponding files from S3. After reverting, run `push` to apply the reverted state to S3.

**Example:**

```bash
node app.js revert 3f2a1b4c-uuid my-project
# Reverted index.js to commit 3f2a1b4c-...

# Then re-push the reverted state:
node app.js push johndoe my-project
```

> ℹ️ The `commitID` is the UUID printed when you ran `commit`, and is also stored in each `commit.json` file inside `prevCommits/`.

---

## 📡 API Reference

> All endpoints except `/auth` routes require: `Authorization: Bearer <token>`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive a JWT |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/:username` | Get user profile |
| `PUT` | `/api/users/:id` | Update user profile |
| `DELETE` | `/api/users/:id` | Delete account |

### Repositories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/repos` | List all repositories |
| `GET` | `/api/repos/:id` | Get a single repository |
| `POST` | `/api/repos` | Create a new repository |
| `PUT` | `/api/repos/:id` | Update repository details |
| `DELETE` | `/api/repos/:id` | Delete a repository |
| `POST` | `/api/repos/:id/star` | Star / unstar a repository |

### Issues

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/repos/:repoId/issues` | List issues for a repo |
| `POST` | `/api/repos/:repoId/issues` | Create a new issue |
| `PUT` | `/api/repos/:repoId/issues/:id` | Update an issue |
| `DELETE` | `/api/repos/:repoId/issues/:id` | Delete an issue |

### Files & Commits

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/repos/:id/files` | Get repo file tree |
| `PUT` | `/api/repos/:id/files` | Edit file content and save as commit |
| `GET` | `/api/repos/:id/commits` | Get commit history |

### Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/uploadthing` | Upload files via UploadThing |

---

## 📁 Project Structure

```
gitclone/
├── app.js                           # Entry point: server start + CLI (Yargs)
│
├── src/
│   ├── config/
│   │   ├── db-config.js             # MongoDB Atlas connection
│   │   └── aws-config.js            # AWS S3 client setup
│   │
│   ├── controllers/
│   │   ├── terminalCommands/
│   │   │   ├── init.js              # CLI: init — creates .repoGit/
│   │   │   ├── add.js               # CLI: add — stages files
│   │   │   ├── commit.js            # CLI: commit — creates UUID commit folder
│   │   │   ├── push.js              # CLI: push — uploads commits to S3
│   │   │   ├── pull.js              # CLI: pull — downloads files from S3
│   │   │   └── revert.js            # CLI: revert — rolls back to a commit
│   │   └── ...                      # REST API controllers
│   │
│   ├── models/                      # Mongoose schemas (User, Repo, Issue, etc.)
│   ├── routes/
│   │   └── main.routes.js           # All API route definitions
│   ├── middleware/                  # JWT auth middleware
│   └── utils/
│       ├── uploadthing.js           # UploadThing file router
│       └── helper.js                # isUserVerified, isRepoVerified
│
└── client/                          # React frontend
    ├── src/
    │   ├── components/              # Reusable UI components
    │   ├── pages/                   # Route-level pages
    │   ├── context/                 # Auth & global state
    │   └── utils/                   # API helpers
    └── public/
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port for the Express server (default: `5000`) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_REGION` | S3 bucket region (e.g. `us-east-1`) |
| `S3_BUCKET` | Name of your S3 bucket |
| `UPLOADTHING_SECRET_KEY` | UploadThing API secret |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Your Name](https://github.com/your-username)

⭐ Star this repo if you found it helpful!

</div>
