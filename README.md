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

## Deployment Guide (AWS EC2 + Nginx)

This guide assumes you are using an **Ubuntu** server on AWS EC2.

### 1. Prepare the Server
Update packages and install dependencies:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-pip python3-venv nginx nodejs npm git -y
```

### 2. Clone the Repository
Clone your code to the server (replace URL with your repo):
```bash
cd /home/ubuntu
git clone <YOUR_RECT_URL> todo-app
cd todo-app
```

### 3. Setup Backend
Set up Python virtual environment and install requirements:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Setup Systemd Service (Run Backend in Background)
Check the `deployment/todo-backend.service` file to ensure paths are correct (`/home/ubuntu/todo-app...`).
Copy the service file to systemd:
```bash
sudo cp ../deployment/todo-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start todo-backend
sudo systemctl enable todo-backend
```
Check status: `sudo systemctl status todo-backend`

### 5. Setup Frontend
Build the React app for production:
```bash
cd ../frontend
npm install
npm run build
```
This creates a `build` folder at `/home/ubuntu/todo-app/frontend/build`.

### 6. Configure Nginx
Copy the provided Nginx config:
```bash
sudo cp ../deployment/nginx.conf /etc/nginx/sites-available/todo-app
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/todo-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
sudo systemctl restart nginx
```

### 7. Done!
Visit your server's public IP address in the browser.
- Frontend loads from Nginx.
- API requests go through Nginx to FastAPI.

