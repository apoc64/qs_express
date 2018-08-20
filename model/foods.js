const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

exports.getAll = function () {
  console.log("called model get all");
  return database('foods').select()
  .then((foods) => {
    return foods
  })
}
