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
  database('foods').where('id', request.params.id).select()
  .then((foods) => {
    response.status(200).json(foods[0]);
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
  database('foods').where('id', request.params.food_id)
  .then((food) => {
    const food_name = food[0].name.toUpperCase();
    database('meals').where('id', request.params.meal_id)
    .then((meal) => {
      const meal_name = meal[0].name.toUpperCase()
      database('meal_foods')
      .where({'meal_id': request.params.meal_id, 'food_id': request.params.food_id}).del()
      .then((success) => {
        if(success) {
          response.status(200).json({'message': `Successfully removed ${food_name} to ${meal_name}`});
        } else {
          response.status(404).json({'message': 'Failed to remove food from meal'})
        } // end if/else success
      })
    }) // then meal
  }) // then food
}); // end delete meal food

// Listener:
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
