const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

exports.getFavorites = () => {
  return database('foods').select()
  .then((foods) => {
    return foods
  });
};
