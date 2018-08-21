exports.parseMeals = function (meals) {
  var meals_response = [{}, {}, {}, {}] // stubs response
  meals.forEach((mealItem) => {
    var mealObj = meals_response[mealItem.id - 1] // get correspopnding meal
    mealObj = checkNewMeal(mealObj, mealItem)
    mealObj = checkAddFood(mealObj, mealItem)
    meals_response[mealItem.id - 1] = mealObj // add object to respopnse
  }) // end for each meal_item
  return meals_response
} // end parseMeals

exports.parseMeal = function (mealItems) {
  var mealObj = {}
  mealItems.forEach((mealItem) => {
    mealObj = checkNewMeal(mealObj, mealItem)
    mealObj = checkAddFood(mealObj, mealItem)
  })
  return mealObj
} // end parse single meal

function checkNewMeal(mealObj, mealItem) {
  if(!mealObj['id']) { // if meal is new
    mealObj = { // set name and id
      'id': mealItem.id,
      'name': mealItem.name
    }
    mealObj['foods'] = []
  } // end if meal is new
  return mealObj
}

function checkAddFood(mealObj, mealItem) {
  if(mealItem['food_id']) { // won't add food if no food present
    mealObj.foods.push({
      'id': mealItem.food_id,
      'name': mealItem.food_name,
      'calories': mealItem.calories
    })
  }
  return mealObj
}
