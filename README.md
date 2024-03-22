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

  - Build the Docker containers:

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

  - Build the application:

    ```bash
    npm run build
    ```

  - Start the application:

    ```bash
    npm start
    ```

  - Application can be started in dev mode watching for changes

    ```bash
    npm run dev
    ```

- Test if application is running

  ```bash
  curl -X GET http://localhost:3000/api/news
  ```

## Usage

Once the application is running, you can access it on [http://localhost:3000/api/](http://localhost:3000/api/) (default port is set to 3000).

## Endpoints

| Method | Endpoint    | Input Data                                                                 | Expected Data                                                                                                     |
| ------ | ----------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| POST   | `/news`     | `{ "title": string, "description": string, "text": string, "date": Date }` | `{ "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }`          |
| GET    | `/news/:id` |                                                                            | `{ "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }`          |
| GET    | `/news`     |                                                                            | `[ { "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }, ... ]` |
| PATCH  | `/news/:id` | `{ "title": string, "description": string, "text": string, "date": Date }` | `{ "title": string, "description": string, "text": string, "date": Date, "_id": string, "__v": number }`          |
| DELETE | `/news/:id` |                                                                            | `{ "message": "News deleted successfully" }`                                                                      |
| DELETE | `/news`     | `{ "newsIds": [string] }`                                                  | `{ "message": "All news deleted successfully" }`                                                                  |

## Filtering & Sorting

The API supports filtering and sorting of news articles based on certain criteria.

### Filtering

You can filter news articles by specifying one or more of the following query parameters:

- `date`: Filter news articles by a specific date. The date should be provided in ISO 8601 format (e.g., `2024-03-20`).
- `title`: Filter news articles by a specific title. The title should be provided as a string.

### Sorting

You can sort news articles by date and/or title in ascending or descending order by specifying the following query parameters:

- `sortBy`: Sort news articles by either `date` or `title`.
- `orderBy`: Specify the order of sorting. Use `asc` for ascending order or `desc` for descending order.

When `sortBy` is specified, `orderBy` should be specified as well in order to sort the results.

#### Example Usage

To filter and/or sort news articles, make a GET request to the `/news` endpoint with the desired query parameters:

- Filter news articles by date: `/news?date=2024-03-20`
- Filter news articles by title: `/news?title=Example%20Title`
- Sort news articles by date in ascending order: `/news?sortBy=date&orderBy=asc`
- Sort news articles by title in descending order: `/news?sortBy=title&orderBy=desc`

## Validation

### Input Validation Middleware

There are two middlewares that validate user input. `validateRequiredNewsInput` for the `POST` request with all fields except `date` required and `validatePatchNewsInput` used for partial update of news (`PATCH`) where all fields are optional. The following rules are enforced for validation:

- `title`: Required, maximum length of 255 characters.
- `description`: Required, maximum length of 255 characters.
- `text`: Required, maximum length of 1MB.
- `date`: Optional, must be in ISO 8601 date format.

If the input data does not meet these requirements, the middleware returns a 400 Bad Request status along with detailed error messages explaining the validation failures.

## Configuration

The application is already configured using environment variables. This is done so it's easier to "plug & play" the api and there is no sensitive info in the `.env` file as well.

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
