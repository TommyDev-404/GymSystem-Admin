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


# Alternative (Manual Installation of Dependencies)

After cloning, open new terminal and execute this command to clear all the pnpm packages:
```
   pnpm store prune
```

For frontend: 
``` 
   cd GymSystem-Admin
   cd frontend
   pnpm install
```

Running the frontend:
```
   pnpm dev
```

For backend, open new terminal: 
``` 
   cd GymSystem-Admin
   cd backend
   pnpm install
```

Running the backend:
```
   pnpm dev
```

Open browser and go to the this link:
```
   http://localhost:5173/login
```

For database:
- Open XAMPP, start MySQL and Apache
- Open browser and go to:
```
   localhost/phpmyadmin
```
- Create a database, name it "gym_db".
- Then, copy the schema in creating tables in found in db folder and schema.sql
- Include the seed.sql for demo admin account