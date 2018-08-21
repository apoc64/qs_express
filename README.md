# Quantified Self

This app provides an Express based backend for a calorie tracking app. The frontend is deployed at http://brawny-lunchroom.surge.sh/index.html, with this backend at, https://qs-express-steve.herokuapp.com/. The frontend repo is: https://github.com/apoc64/qs_frontend. Please note, that the frontend will require changes to the baseURL variable in order to point to a different backend location.

## Express Version

This app uses:

* Express 4.16.0
* JavaScript ES6

## Setup

After cloning down the project, run

* npm install

### Database Setup

This app uses a Postgresql database, which must be created in psql. If you have a local pg database for the root user, you can run

* psql

If you do not have a database for the root user, entering the psql command line will vary. Once in the psql command line, run:

* CREATE DATABASE qs_express;
* \q
(this will exit psql)

* knex migrate:latest
* knex seed:run

This should create the database along with sample data. The test suite can also run migrations, seeding and verify proper setup.

## Testing

To run the tests, type:

* mocha --exit

