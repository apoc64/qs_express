require('es6-promise').polyfill();
require("isomorphic-fetch")

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const yummlyKey = process.env.YUMMLY_KEY
const yummlyID = process.env.YUMMLY_ID
const foodModel = require('./foods.js')


exports.getRecipes = (id) => {
  return foodModel.getFood(id)
  .then((food) => {
    const url = yummlyURL(food.name)
    console.log(url);

    return fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((recipes) => {
      console.log(JSON.stringify(recipes));
      return recipes
    })

  })
}

function yummlyURL(name) {
  return `https://api.yummly.com/v1/api/recipes?_app_id=${yummlyID}&_app_key=${yummlyKey}&q=${name}`
}
