const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const yummlyKey = process.env.YUMMLY_KEY
const foodModel = require('./foods.js')


exports.getRecipes = (id) => {
  return foodModel.getFood(id)
  .then((food) => {
    console.log(food);
    console.log(yummlyKey);
  })
}
