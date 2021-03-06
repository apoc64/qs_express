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
  .returning(['id', 'name', 'calories'])
  .then((food) => {
    return (food[0])
  })
}

exports.getFood = function (id) {
  return database('foods').where('id', id).select()
  .then((foods) => {
    return (foods[0]);
  });
};

exports.deleteFood = function (id) {
  return database('foods').where('id', id).del()
  .then((success) => {
    if(success) {
      return ({status: 204, body: { message: "food deleted" }})
    } else {
      return ({status: 404, body: { message: "invalid food" }})
    }
  })
}

exports.updateFood = function (id, foodParams) {
  return database('foods').where('id', id)
  .update(foodParams)
  .then(() => {
    return ({status: 200, body: {message: "successfully updated food"}})
  })
  .catch((error) => {
    return ({status: 500, body: { error }})
  })
}
