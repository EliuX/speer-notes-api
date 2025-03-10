Speer Notes API
=================

Back End Assessment project for Senior Full Stack Developer (Speer)


## Requirements

### Required tech

- [Node v22+](https://nodejs.org/en/download/)
- [Nest CLI](https://docs.nestjs.com/cli/overview)
- [MongoDB Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/)
- [Docker](https://docs.docker.com/get-docker/)


### Functional requirements

The project must be compliant with the [project overview](./docs/project-overview.md).

### Design decisions

- [TypeORM](https://typeorm.io/#/)

  TypeORM was chosen for its superior compatibility with TypeScript and its seamless integration with MongoDB, outperforming alternatives like Mongoose. It offers a robust and flexible ORM framework that integrates well with NestJS, facilitating easy database management and migrations. TypeORM's extensive documentation and support for multiple database systems make it a versatile choice for various project requirements.

- Throttling management: To implement rate limiting and request throttling in the NestJS application, the `nestjs/throttler` package was used. This package provides an easy way to limit the number of requests per user/IP, configured to allow a maximum of 10 requests per minute.

- Authentication: JWT was used for authentication with the help of [nestjs/passport](https://docs.nestjs.com/recipes/passport). This setup secures all endpoints using Guards. The Local guard validates user credentials during login, while the JWT Guard verifies access by extracting the JWT from the header and ensuring it was encrypted with the same secret. For notes, the token data is used to access the authenticated user's ID, enabling seamless resource filtering.

## Project setup

- Firstly, install the dependencies

  ```bash
  $ yarn install
  ```

- Secondly, start services (MongoDB) with docker compose

  ```bash
  $ docker-compose up -d   
  ```

## Compile and run the project

- Start the project depending on the environment

  ```bash
  # development
  $ yarn run start

  # watch mode
  $ yarn run start:dev

  # production mode
  $ yarn run start:prod
  ```  

- Open your browser and navigate to _http://localhost:8080/_.

> You can change the port with the env variable `PORT`, which by default is `3000`.

### Authenticate

For authenticating using the credentials of an existing user you must use the following
command:

```bash
$ curl -X POST http://localhost:3000/auth/login -d '{"username": "6763819045fff580d4e42ffc", "password": "stringst"}' -H "Content-Type: application/json"
{"access_token":"the jwt goes here...."}
```

## Run tests

This project provides multiple ways of testing the API for notes.


### Manual tests

You can to test manually the project the following ways:
- Starting the app and checking the [swagger API](http://localhost:8080/swagger)
- Execute the available [Postman collection in docs](./docs/speer-notes-api.postman_collection.json).

### Automated tests
You can run the following tests:

  ```bash
  # unit tests
  $ yarn run test

  # e2e tests
  $ yarn run test:e2e

  # test coverage
  $ yarn run test:cov
  ```

  This project emphasizes end-to-end (e2e) tests to ensure comprehensive functionality coverage. However, you will also find unit tests for key components, and you can analyze the overall test coverage.

## Stay in touch

- Author - [Eliecer Hernandez](https://twitter.com/EliuX)
- Website - [https://eliux.github.io](https://eliux.github.io)
- Stack Overflow - [user:3233398](https://stackoverflow.com/users/3233398/eliux?tab=profile)
