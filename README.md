# Trello-clone application server side(PostgreSQL)

## Application Technology Stack

The application is written by JavaScript/NodeJS/ExpressJS/PostgreSQL.
The security of requests to the server is based on technology Passport JWT.

## Prerequisites

You need to install follow software:

- npm
 ```sh
sudo apt-get install npm
  ```

- Node.js 

 ```sh
$ node -v 
14.16.0
  ```

## Application installation

 - Clone the repository

  ```sh
$ git clone https://github.com/Superior-925/Trello-backend.git
 ```

- Go to project folder

```sh
$ cd Trello-backend
 ```

- Create .env and set the following params:

```sh
PORT
DB_HOST
DB_USERNAME
DB_PASSWORD
DB_NAME
 ```

- Install dependencies by NPM

 ```sh
$ npm install
```

 - Create a database

```sh
$ npm run db:create
 ```

- Create a table

```sh
$ npm run db:migrate
 ```

 - Start the server by the command

 ```sh
$ npm run dev
```

 - To start the server with a test database (don't forget to create one), enter the command
 
  ```sh
 $ npm run start:test
 ```

## To test the server run the following commands

- Create test database

```sh
$ npm run db:create-test
 ```

- Create a test table

```sh
$ npm run db:migrate-test
 ```

- Start MOCHA

```sh
$ npm run test
 ```

If you have questions - contact me on email skykeeper925@gmail.com
Best regards Anton Logunov.
