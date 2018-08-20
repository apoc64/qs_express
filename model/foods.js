const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

exports.getAll = function () {
  return database('foods').select()
  .then((foods) => {
    return foods
  });
};

exports.postFood = function (food) {
  return database('foods').insert(food)
  .then(() => {
    return ({ message: "food created" })
  })
}

exports.getFood = function (id) {
  return database('foods').where('id', id).select()
  .then((foods) => {
    return (foods[0]);
  });
};
