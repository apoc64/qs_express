exports.seed = function(knex, Promise) {

  return knex('meal_foods').del()
    .then(() => knex('meals').del())
    .then(() => knex('foods').del())
    .then(() => {
      return Promise.all([

        knex('meals').insert([
          { name: 'Breakfast', id: 1 },
          { name: 'Snack', id: 2 },
          { name: 'Lunch', id: 3 },
          { name: 'Dinner', id: 4 },
        ])
        .then(() => {
          return knex('foods').insert([
            { name: 'pizza', calories: 400, id: 1 },
            { name: 'salad', calories: 100, id: 2 },
            { name: 'banana', calories: 150, id: 3 }
          ])
        })
        .then(() => {
          return knex('meal_foods').insert([
            { meal_id: 1, food_id: 3 },
            { meal_id: 4, food_id: 2 },
            { meal_id: 3, food_id: 2 },
            { meal_id: 4, food_id: 1 }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
  };
