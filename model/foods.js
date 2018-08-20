const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

exports.getAll = function () {
  console.log("called model get all");
  return database('foods').select()
  .then((foods) => {
    return foods
  });
};

exports.postFood = function (food) {
  console.log("called model post food");
  return database('foods').insert(food)
  .then(() => {
    // response.status(201).json({ message: "food created" })
    return ({ message: "food created" })
  })
  // .catch(error => {
  //   // response.status(500).json({ error })
  //   return (500, { error })
  // })
}

function printThing() {
  console.log("yo");
}
