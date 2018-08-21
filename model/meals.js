const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const mealSerializer = require('../helpers/meal_serializer');


exports.getMeals = function () {
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

exports.deleteFoodMeal = function(foodId, mealId) {
  return database('foods').where('id', foodId)
  .then((food) => {
    const food_name = food[0].name.toUpperCase();
    return database('meals').where('id', mealId)
    .then((meal) => {
      const meal_name = meal[0].name.toUpperCase()
      return database('meal_foods')
      .where({'meal_id': mealId, 'food_id': foodId}).del()
      .then((success) => {
        if(success) {
          return ({'message': `Successfully removed ${food_name} to ${meal_name}`});
        } else {
          return ({'message': 'Failed to remove food from meal'})
        } // end if/else success
      })
    }) // then meal
  }) // then food
}

exports.getMeal = function(id) {
  return database('meals')
  .where('meals.id', id)
  .select('meals.id', 'meals.name', 'foods.id AS food_id', 'foods.name AS food_name', 'calories')
  .leftOuterJoin('meal_foods', 'meals.id', 'meal_foods.meal_id')
  .leftOuterJoin('foods', 'foods.id', 'meal_foods.food_id')
  .then((meal) => {
    // console.log(meal);
    const meals_response = mealSerializer.parseMeal(meal)
    return (meals_response);
  })
}
