
---

```markdown
# 📝 Full Stack To-Do App (React + Node.js + AWS ECS Fargate)

A simple full stack To-Do application with:

- React frontend
- Node.js/Express backend
- JSON file-based storage
- Dockerized services
- Deployed using AWS ECS (Fargate) with public IP access

---

## 🧱 Project Structure

```

todo-project/
├── backend/
│   ├── server.js
│   ├── todos.json
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── App.js
│   ├── public/
│   ├── package.json
│   └── Dockerfile

🚀 Local Setup

### 1. Backend

```bash
cd backend
npm install
node server.js

The server will start on: `http://localhost:5000`
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The app will run on: `http://localhost:3000`

Make sure the API URL inside `App.js` points to the backend (e.g., `http://localhost:5000/todos`).

---

## 🐳 Docker Setup

### 1. Build Docker Images

```bash
# Backend
cd backend
docker build -t todo-backend .

# Frontend
cd ../frontend
docker build -t todo-frontend .
```

### 2. Run Containers Locally (Optional)

```bash
docker run -p 5000:5000 todo-backend
docker run -p 3000:3000 todo-frontend
```

---

## ☁️ AWS ECS Deployment (Fargate)

### 🛠 Prerequisites

* AWS CLI configured (`aws configure`)
* ECR repository for both images
* ECS Cluster (`todo-cluster`)
* Public subnets and security group allowing ports (80, 5000)
* IAM role with ECS/Fargate access

---

### 1. Push Images to ECR

```bash
# Authenticate Docker to AWS ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com

# Tag and push backend image
docker tag todo-backend <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/todo-backend:latest
docker push <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/todo-backend:latest

# Tag and push frontend image
docker tag todo-frontend <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/todo-frontend:latest
docker push <aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/todo-frontend:latest
```

---

### 2. Register ECS Task Definitions

#### Sample `todo-backend-task-def.json`

```json
{
  "family": "todo-backend-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "todo-backend",
      "image": "<aws_account_id>.dkr.ecr.eu-north-1.amazonaws.com/todo-backend:latest",
      "portMappings": [
        { "containerPort": 5000, "protocol": "tcp" }
      ],
      "essential": true
    }
  ]
}
```

Register task:

```bash
aws ecs register-task-definition \
  --cli-input-json file://todo-backend-task-def.json \
  --region eu-north-1
```

Repeat similarly for the frontend task definition.

---

### 3. Create ECS Services

```bash
aws ecs create-service \
  --cluster todo-cluster \
  --service-name todo-backend-service \
  --task-definition todo-backend-task \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx],assignPublicIp=ENABLED}" \
  --desired-count 1 \
  --region eu-north-1
```

Repeat for the frontend service with corresponding values.

---

### 4. Update Service (After Changes)

```bash
# Build, tag, and push new image
docker build -t todo-frontend .
docker tag todo-frontend <ecr_url>/todo-frontend:latest
docker push <ecr_url>/todo-frontend:latest

# Register new revision
aws ecs register-task-definition \
  --cli-input-json file://todo-frontend-task-def.json \
  --region eu-north-1

# Update service
aws ecs update-service \
  --cluster todo-cluster \
  --service todo-frontend-service \
  --task-definition todo-frontend-task:<revision_number> \
  --region eu-north-1
```

---

## 🌐 Public Access

If `assignPublicIp=ENABLED` and security group allows port 80/5000:

```
Frontend: http://<frontend_public_ip>
Backend API: http://<backend_public_ip>:5000/todos
```

Update the fetch URL in frontend accordingly (use public IP of backend).

---

## 📌 Notes

* Storage uses a JSON file — not suitable for production.
* For real apps, use RDS/MongoDB and secure backend APIs.
* Add HTTPS, logging, monitoring for production-ready deployments.

---

## 👤 Author

**Swetha Hirge**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?logo=linkedin&logoColor=white&style=flat-square)](https://www.linkedin.com/in/swetha-hirge)