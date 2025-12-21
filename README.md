# Simple To-Do App (FastAPI + React)

A simple full-stack To-Do application using FastAPI (backend) and React (frontend).
Data is stored in-memory and will adhere to the restrictions of a single server environment without a database.

> **NOTE:** This app uses in-memory storage, so data resets when the server restarts.

## Prerequisites

- Python 3.7+
- Node.js and npm

## Project Structure

```
project-root/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   └── ... (React App)
└── README.md
```

## Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3.  Run the server:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000
    ```

    The API will be available at `http://localhost:8000`.
    Interactive docs are at `http://localhost:8000/docs`.

## Frontend Setup

### Development

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm start
    ```

    The app will open at `http://localhost:3000`.
    API requests to `/api` are proxied to `http://localhost:8000`.

### Production Build

To build the frontend for production (static files):

1.  Run the build command:
    ```bash
    npm run build
    ```

    This creates a `build` directory with static files that can be served by a web server (e.g., Nginx, Apache, or Python's `http.server`).

## Architecture Details

-   **Communication**: Frontend sends requests to `/api/todos` (GET, POST) and `/api/todos/{id}` (DELETE).

## Deployment

For detailed deployment instructions (AWS EC2 + Nginx), please refer to [deployment/README.md](deployment/README.md).

