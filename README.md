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

### Library decisions

- [TypeORM](https://typeorm.io/#/)

I chose TypeORM for providing better compatibility with TypeScript than integration with MongoDB better than other choices, like Mongoose. It provides a robust and flexible ORM framework that integrates seamlessly with NestJS, allowing for easy database management and migrations. TypeORM's extensive documentation and support for multiple database systems make it a versatile choice for various project requirements.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

- Start services (MongoDB) with docker compose

  ```bash
  $ docker-compose up -d   
  ```

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
{"access_token":"jwt has here...."}
```

## Run tests

  ```bash
  # unit tests
  $ yarn run test

  # e2e tests
  $ yarn run test:e2e

  # test coverage
  $ yarn run test:cov
  ```

## Stay in touch

- Author - [Eliecer Hernandez](https://twitter.com/EliuX)
- Website - [https://eliux.github.io](https://eliux.github.io)
- Stack Overflow - [user:3233398](https://stackoverflow.com/users/3233398/eliux?tab=profile)
