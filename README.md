# Health Information System

The system manages a set of users, clients, and programs.

The `User` is an authentication entity. A client has a one to one relationship with a single user purposely to enable a registered client to login and view a doctor's notes on the health program he or she is enrolled in.

The following is the ERD diagram:
![ERD DIAGRAM](erd.png)

When a new client is registered a corresponding user is established with the `client` and attached to the client. The client's email is used to create a password the client can use to log in.

Doctor's can simply signup and the super admin assigns them the `doctor` role.

## How to run

To easily help spin up the services, docker compose has been implemented to containerize and manage a postgres database instance and a nuxtjs app instance.

Task runner has also been implemented to help spin of the services and clean up based on specific tasks.

### Prerequisites

1. Linux operating system
2. Docker
3. Docker Compose
4. TaskRunner

### Ports

1. 3000 NuxtJs APP
2. 5434 Postgres database instance

Visit [https://taskfile.dev/](https://taskfile.dev/) for a guide to getting up and running with `Taskrunner`.

The above command starts the two services. The nuxt service waits for the database to be healthy before making migrations and seeding a single admin user and 5 client users.

### 1. To run each separately

Start the database and app separately:

Step 1: Start the database

```sh
    task start:dev
```

Step 2: Install packages with yarn

```sh
    yarn install
```

Step 3: Create a .env file and insert the following database url:

```ini
DATABASE_URL="postgresql://user_postgres:password_postgres@localhost:5434/db_postgres?schema=public"
JWT_SECRET="DzwJ03dDbkSMiT75wLVyDa8LfnKTsvZXmmmUaESdMGg="
```

Step 4: Run migrations, push to database, and seed the database.

```sh
    yarn prisma db migrate dev && yarn prisma generate dev && yarn prisma db seed
```

Step 5: Start the app

```sh
    yarn dev
```

### 2. Launch the services

```sh
    task start
```

Visit [NUXT FRONTEND](http://localhost:3000) to view the web interface.

**_Login with the seeded admin user_**
Use the following email and password

- Email: `admin@app.com`
- Password: `admin1234`

### Clean up

```sh
    task clean
```

Below is a link to a video demonstrating various user roles and functionalities:

[Live Demo](https://drive.google.com/file/d/1dDBkWOFfB5RUTUqtII7KKun4p4HC7GC4/view?usp=sharing)
