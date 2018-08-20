const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const mealSerializer = require('../helpers/meal_serializer');


exports.getMeals = function () {
  console.log("called model getMeals");
  return database('meals')
  .select('meals.id', 'meals.name', 'foods.id AS food_id', 'foods.name AS food_name', 'calories')
  .leftOuterJoin('meal_foods', 'meals.id', 'meal_foods.meal_id')
  .leftOuterJoin('foods', 'foods.id', 'meal_foods.food_id')

  .then((meals) => {
    const meals_response = mealSerializer.parseMeals(meals)
    return (meals_response);
  }) // end then - JSON parse
}

exports.postFoodMeal = function (foodId, mealId) {
  return database('foods').where('id', foodId)
  .then((food) => {
    const foodName = food[0].name.toUpperCase();
    return database('meals').where('id', mealId)
    .then((meal) => {
      const mealName = meal[0].name.toUpperCase()
      return database('meal_foods')
      .insert({'meal_id': mealId, 'food_id': foodId})
      .then(() => { // 404?
        return ({'message': `Successfully added ${foodName} to ${mealName}`})
      })
    }) // then meal
  }) // then food
}
