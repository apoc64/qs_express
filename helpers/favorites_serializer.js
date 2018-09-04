exports.parseMealFoods = (mealFoods, favorites) => {
  console.log(mealFoods);
  const rows = favorites.rows
  const maxCount = rows[0].food_count
  const mostEatenWithCount = rows.filter(row => row.food_count === maxCount)

  const mostEaten = mapEatenFoods(mostEatenWithCount, maxCount, mealFoods)

  return {
    "timesEaten": parseInt(maxCount),
    "foods": mostEaten
  }
}

function mapEatenFoods(mostEatenWithCount, maxCount, mealFoods) {
  return mostEatenWithCount.map(row => {
    const mealNames = mealFoods.filter(mealRow => {
      return mealRow.food_id == row.id
    }).map(nameRow => nameRow.name)
    return {
      "name": row.name,
      "calories": row.calories,
      "mealsWhenEaten": mealNames
    }
  })
}
