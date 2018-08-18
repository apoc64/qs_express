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


// Listener:
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
