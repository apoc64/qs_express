const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const foodModel = require('./model/foods.js')
const mealModel = require('./model/meals.js')

app.use(cors())

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'QS Express';

app.get('/', (request, response) => {
  response.send("Here's a response");
});

// Food Routes:
app.get('/api/v1/foods', (request, response) => {
  foodModel.getAll().then((foods) => {
    response.status(200).json(foods);
  });
});

app.post('/api/v1/foods', (request, response) => {
  foodModel.postFood(request.body.food)
  .then((message) => {
    response.status(201).json(message);
  });
});

app.get('/api/v1/foods/:id', (request, response) => {
  foodModel.getFood(request.params.id)
  .then((food) => {
    response.status(200).json(food)
  })
});

app.delete('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).del()
  .then((success) => {
    if(success) {
      response.status(204).json({ message: "food deleted" });
    } else {
      response.status(404).json({ message: "invalid food" });
    }
  })
});

// Meal Routes:
app.get('/api/v1/meals', (request, response) => {
  mealModel.getMeals().then((meals) => {
    response.status(200).json(meals);
  })
}); // end get meals

app.post('/api/v1/meals/:meal_id/foods/:food_id', (request, response) => {
  mealModel.postFoodMeal(request.params.food_id, request.params.meal_id)
  .then((message) => {
    response.status(201).json(message)
  });
}); // end post meal food

app.delete('/api/v1/meals/:meal_id/foods/:food_id', (request, response) => {
  mealModel.deleteFoodMeal(request.params.food_id, request.params.meal_id)
  .then((message) => {
    response.status(200).json(message);
  });
}); // end delete meal food

// Listener:
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
