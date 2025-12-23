# Deployment Guide (AWS EC2 + Nginx)

This guide details how to deploy the application on an AWS EC2 instance (Ubuntu).

## 1. Launch & Configure EC2
1.  **AMI**: Ubuntu 20.04 or 22.04.
2.  **Instance Type**: t2.micro (Free Tier).
3.  **Key Pair**: Download and save the `.pem` file securely.
4.  **Security Group**: Configure Inbound rules:
    - **SSH (22)**: My IP (for safe remote access).
    - **HTTP (80)**: Anywhere (for the web application).
    - **Custom TCP (8000)**: Anywhere (for backend verification).
    - *(Optional)* **HTTPS (443)**: Anywhere (for SSL later).

## 2. Connect & Prepare Server
From your local machine, run:
```bash
ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>
```
*If this works, EC2 is running and ready.*

Now, update packages and install dependencies correctly for Ubuntu 22.04:

**Step 1: Install correct Node.js (v18 LTS)**
The default Ubuntu repository has an old Node version. Use NodeSource:
```bash
# Remove potential old versions
sudo apt remove nodejs npm -y
sudo apt autoremove -y

# Install Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installation
node -v  # Should be v20.x.x
npm -v
```

**Step 2: Install PM2 globally**
```bash
sudo npm install -g pm2
```

**Step 3: Install System Dependencies**
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx git -y
```

## 3. Clone the Repository
```bash
cd /home/ubuntu
git clone <YOUR_REPO_URL> todo-app
cd todo-app
```

## 4. Backend Setup
Set up the Python environment and dependencies:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
deactivate  # Exit venv (the service will use it later)
```

## 5. Configure PM2 (Process Manager)
Use PM2 to run the backend in the background.

1.  **Start Backend**:
    Make sure you are in the root directory (`/home/ubuntu/todo-app`) and the venv is created (see Step 4).
    ```bash
        pm2 start backend/venv/bin/uvicorn \
        --name todo-backend \
        --cwd backend \
        --interpreter none \
        -- main:app --host 0.0.0.0 --port 8000
    ```
    *Note: We point directly to the python executable in the venv so we don't need activation scripts.*
2.  **Save & Startup**:
    This ensures the app restarts on reboot.
    ```bash
    pm2 save
    pm2 startup
    # Run the command output by 'pm2 startup' if prompted
    ```
4.  **Verify status**:
    ```bash
    pm2 status
    ```

## 6. Frontend Setup
Build the React application for production:
```bash
cd frontend
npm install
npm run build
```
*This creates the static files in `/home/ubuntu/todo-app/frontend/build`.*

## 7. Configure Nginx
Set up Nginx to serve the frontend and proxy API requests.

1.  **Copy Nginx config**:
    ```bash
    sudo cp ../deployment/nginx.conf /etc/nginx/sites-available/todo-app
    ```
2.  **Enable the site**:
    ```bash
    # Link to sites-enabled
    sudo ln -s /etc/nginx/sites-available/todo-app /etc/nginx/sites-enabled/
    
    # Remove default Nginx site
    sudo rm /etc/nginx/sites-enabled/default
    ```
3.  **Fix Permissions (Crucial Step)**:
    Nginx needs permission to access files in your home directory.
    ```bash
    chmod 755 /home/ubuntu
    ```
4.  **Test and Restart Nginx**:
    ```bash
    sudo nginx -t             # Check for syntax errors
    sudo systemctl restart nginx
    ```

## 8. Verification
Open your browser and visit your EC2 instance's **Public IP**.
- The Todo App should load.
- You should be able to add and delete tasks (persisted in-memory).

---

## Troubleshooting

- **403 Forbidden Error**:
    - Usually means Nginx cannot read the frontend files.
    - Run: `namei -om /home/ubuntu/todo-app/frontend/build/index.html` to check permissions.
    - Ensure `/home/ubuntu` has `+x` (execute/search) permission: `chmod 755 /home/ubuntu`.

- **502 Bad Gateway**:
    - The Nginx server cannot talk to the Backend.
    - Check Backend status: `sudo systemctl status todo-backend`.
    - Check if port 8000 is listening: `netstat -tuln | grep 8000`.

- **View Logs**:
    - **Backend**: `sudo journalctl -u todo-backend -f`
    - **Nginx Error**: `sudo tail -f /var/log/nginx/error.log`
    - **Nginx Access**: `sudo tail -f /var/log/nginx/access.log`
