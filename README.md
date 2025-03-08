Speer Notes API
=================

Back End Assessment project for Senior Full Stack Developer (Speer)


## Requirements

- [Node v22+](https://nodejs.org/en/download/)
- [Nest CLI](https://docs.nestjs.com/cli/overview)
- [MongoDB Community Edition](https://www.mongodb.com/docs/manual/administration/install-community/)
- [Docker](https://docs.docker.com/get-docker/)

### Library decisions

- [TypeORM](https://typeorm.io/#/)

I chose TypeORM for providing better compatibility with TypeScript than integration with MongoDB better than other choices, like Mongoose. It provides a robust and flexible ORM framework that integrates seamlessly with NestJS, allowing for easy database management and migrations. TypeORM's extensive documentation and support for multiple database systems make it a versatile choice for various project requirements.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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

- Open your browser and navigate to http://localhost:8080/.

> You can change the port with the env variable `PORT`, which by default is `3000`. I personally set it to `8080` or 
> `3001` so it won't conflict with the webapp.

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
