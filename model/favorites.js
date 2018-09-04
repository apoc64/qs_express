const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const favSerializer = require('../helpers/favorites_serializer');

exports.getFavorites = () => {
  return database.raw("SELECT foods.id, foods.name, foods.calories, COUNT(meal_foods.food_id) AS food_count FROM meal_foods INNER JOIN foods ON foods.id=meal_foods.food_id GROUP BY foods.id ORDER BY food_count DESC")
  .then((favorites) => {
    console.log(favorites.rows);
    return database('meals')
    .select('meals.name', 'meal_foods.food_id')
    .innerJoin('meal_foods', 'meals.id', 'meal_foods.meal_id')
    .then((mealFoods) => {
      return favSerializer.parseMealFoods(mealFoods, favorites)
    })
  });
};
