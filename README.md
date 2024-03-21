# REST API for news

## Overview

This project is a task from Global Infra Tech for a simple REST API for news. It can be run locally using either Docker or directly with Node.js. The app is built with **Typescript**, **Koa**, **MongoDB** & **Docker**. **Jest** with **Supertest** for testing. There is also logging with **winston** and proper validation with **Joi**.

## Task description

- Each entity should contain the following information: id, date, title, short description, text.
- All requests and responses should be in JSON.
- Requests validation is a must
- API results should be sortable by date and/or title.
- API results should be filterable by date and/or title.
- Use Node.js, MongoDB, Koa
- Add README.md with requirements, setup, start and test instructions
- Deploy on Github.com

**BONUS TASKS**

- Dockerize application
- Use docker-compose for running the application
- Create simple GRPC client and server with the same requirements

## Requirements

Before running the project, ensure your machine meets the following requirements:

- [Node.js](https://nodejs.org/en/download/)
- Running [MongoDB](https://www.mongodb.com/try/download/community) on your machine. Required only if not using Docker.
- Running [Docker](https://www.docker.com/products/docker-desktop) on your machine. Required only if using Docker.

## Setup

Follow these steps to install and run the project:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/bongoslav/Global-Infra-Tech-task.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Global-Infra-Tech-task
   ```

- If using Docker:

  - Build the Docker images:

    ```bash
    docker compose build
    ```

  - Start the Docker containers:

    ```bash
    docker compose up
    ```

- If not using Docker:

  - Install project dependencies:

    ```bash
    npm install
    ```

  - Start the application:

    ```bash
    npm start
    ```

## Usage

Once the application is running, you can access it on [http://localhost:3000/api/](http://localhost:3000) (default port is set to 3000).

## Endpoints

| Method | Endpoint    | Input Data                                                                 | Expected Data                                                                                                     |
| ------ | ----------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| POST   | `/news`     | `{ "title": string, "description": string, "text": string, "date": Date }` | `{ "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }`          |
| GET    | `/news/:id` |                                                                            | `{ "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }`          |
| GET    | `/news`     |                                                                            | `[ { "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }, ... ]` |
| PATCH  | `/news/:id` | `{ "title": string, "description": string, "text": string, "date": Date }` | `{ "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }`          |
| DELETE | `/news/:id` |                                                                            | `{ "message": "News deleted successfully" }`                                                                      |
| DELETE | `/news`     | `{ "newsIds": [string] }`                                                  | `{ "message": "All news deleted successfully" }`                                                                  |

## Validation

### Input Validation Middleware

The `validateNewsInput` middleware function is used to validate input data for the API endpoints related to news creation and updating. It enforces the following validation rules:

- `title`: Required, maximum length of 255 characters.
- `description`: Required, maximum length of 255 characters.
- `text`: Required, maximum length of 1MB.
- `date`: Optional, must be in ISO 8601 date format.

If the input data does not meet these requirements, the middleware returns a 400 Bad Request status along with detailed error messages explaining the validation failures.

## Configuration

The application is already configured using environment variables. This is done so it easy easier to "plug & play" the api and there is no sensitive info in the `.env` file.

## Tests

To run the tests:

```bash
npm test
```

To see test coverage:

```bash
npx jest --coverage
```

Currently the routes and controllers have 100% test coverage:

```bash
npx jest --coverage --collectCoverageFrom=src/controllers/news.ts --collectCoverageFrom=src/routes/news.ts
```

| File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ----------- | ------- | -------- | ------- | ------- | ----------------- |
| All files   | 100     | 100      | 100     | 100     |
| controllers | 100     | 100      | 100     | 100     |
| news.ts     | 100     | 100      | 100     | 100     |
| routes      | 100     | 100      | 100     | 100     |
| news.ts     | 100     | 100      | 100     | 100     |

## License

This project is licensed under the [MIT License].
