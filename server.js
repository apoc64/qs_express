const express = require('express');
var cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

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
  database('foods').select()
  .then((foods) => {
    response.status(200).json(foods);
  })
});

app.post('/api/v1/foods', (request, response) => {
  const food = request.body.food;
  // for - req'd params
  database('foods').insert(food)
  .then(() => {
    response.status(201).json({ message: "food created" })
  })
  .catch(error => {
    respopnse.status(500).json({ error })
  })
});

app.get('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).select()
  .then((foods) => {
    // if ...
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
  // console.log("Getting meals");
  database('meals')
  .select('meals.id', 'meals.name', 'foods.id AS food_id', 'foods.name AS food_name', 'calories')
  .leftOuterJoin('meal_foods', 'meals.id', 'meal_foods.meal_id')
  .leftOuterJoin('foods', 'foods.id', 'meal_foods.food_id')

  .then((meals) => {
    // JS parse response:
    var meals_response = [{}, {}, {}, {}]

    meals.forEach((meal_item) => {
      var meal_obj = meals_response[meal_item.id - 1]
      // debugger
      if(!meal_obj['id']) {
        // console.log("blank");
        meal_obj = {
          'id': meal_item.id,
          'name': meal_item.name,
          'foods': []
        }
      }
      // console.log(meal_obj);
      meal_obj.foods.push({
        'id': meal_item.food_id,
        'name': meal_item.food_name,
        'calories': meal_item.calories
      })
      // console.log(meal_obj);
      meals_response[meal_item.id - 1] = meal_obj
      // console.log(meals_response);
    })

    response.status(200).json(meals_response);
  })
});

// Listener:
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
