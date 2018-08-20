exports.parseMeals = function (meals) {
  var meals_response = [{}, {}, {}, {}] // stubs response

  meals.forEach((meal_item) => {
    var meal_obj = meals_response[meal_item.id - 1] // get correspopnding meal
    if(!meal_obj['id']) { // if meal is new
      meal_obj = { // set name and id
        'id': meal_item.id,
        'name': meal_item.name
      }
        meal_obj['foods'] = []
    } // end if meal is new

    if(meal_item['food_id']) { // won't add food if no food present
      meal_obj.foods.push({
        'id': meal_item.food_id,
        'name': meal_item.food_name,
        'calories': meal_item.calories
      })
    } // end if add food
    meals_response[meal_item.id - 1] = meal_obj // add object to respopnse
  }) // end for each meal_item
  return meals_response
} // end parseMeals
