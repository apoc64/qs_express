const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

exports.getFavorites = () => {
  return database.raw("SELECT foods.id, foods.name, foods.calories, COUNT(meal_foods.food_id) AS food_count FROM meal_foods INNER JOIN foods ON foods.id=meal_foods.food_id GROUP BY foods.id ORDER BY food_count DESC")
  .then((favorites) => {
    console.log(favorites.rows);
    return database('meals')
    .select('meals.name', 'meal_foods.food_id')
    .innerJoin('meal_foods', 'meals.id', 'meal_foods.meal_id')
    .then((mealFoods) => {

      console.log("Inside then");
      console.log(mealFoods);
      var rows = favorites.rows
      const maxCount = rows[0].food_count
      const mostEatenWithCount = rows.filter(row => row.food_count === maxCount)


      const mostEaten = mostEatenWithCount.map(row => {
        const obj = {
          "name": row.name,
          "calories": row.calories,
          "mealsWhenEaten": "hello"
        }
        return obj
      })

      var results = {
        "timesEaten": parseInt(maxCount),
        "foods": mostEaten
      }

      return results
    })


  });
};
