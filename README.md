# How to Run the Application

## Requirements

Before running the project, make sure you have installed:

- Docker
- Docker Compose

Make sure Docker is running before starting the application.

---

## Installation

After cloning the repository, navigate to the project directory:

```bash
cd GymSystem-Admin
```

Build all application images:
```
   docker compose build
```

Wait, until finished. Then, start all services:
```
   docker compose up
```

All done! Now open browser:
```
   http://localhost:5173/login
```

Enter credentials for demo:
Username: admin
Password: 123456

Note: When testing forgot password you need to connect to internet.