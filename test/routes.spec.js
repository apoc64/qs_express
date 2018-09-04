const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const util = require('util')

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.equal("Here's a response");
      done();
    });
  });
});

describe('Food Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database('meal_foods').del()
    .then(() => database('meals').del())
    .then(() => database('foods').del())
    .then(() =>
      database('foods').insert({
        id: 1,
        name: "banana",
        calories: 150
      }).then(() => done())
    );
  });

  it('should return all foods', done => {
    chai.request(server)
    .get('/api/v1/foods')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(1);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('banana');
      response.body[0].should.have.property('calories');
      response.body[0].calories.should.equal(150);
      done();
    });
  }); // it should return all foods

  it('should post a food', done => {
    chai.request(server)
    .post('/api/v1/foods')
    .send({ "food": {
      "name": "pizza",
      "calories": 400
      }
    })
    .end((err, response) => {
      response.should.have.status(201)
      response.body.should.have.property('name')
      response.body.name.should.equal('pizza')
      done();
    });
  }); // it should post a food

  it('should return one food', done => {
    chai.request(server)
    .get('/api/v1/foods/1')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('object');
      response.body.should.have.property('name');
      response.body.name.should.equal('banana');
      response.body.should.have.property('calories');
      response.body.calories.should.equal(150);
      done();
    });
  }); // it should return one food

  it('should delete one food', done => {
    chai.request(server)
    .delete('/api/v1/foods/1')
    .end((err, response) => {
      response.should.have.status(204);

      done();
    });
  }); // it should delete one food

  it('should return a 404 if no food to delete', done => {
    chai.request(server)
    .delete('/api/v1/foods/3')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  }); // it should return 404 if no food
}); // end of food routes

describe('Meal Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  it('should return meals with foods', done => {
    chai.request(server)
    .get('/api/v1/meals')
    .end((err, response) => {
      // console.log(util.inspect(response.body, false, null));
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('array');
      response.body.length.should.equal(4);
      response.body[0].should.have.property('name');
      response.body[0].name.should.equal('Breakfast');
      response.body[0].should.have.property('foods');
      response.body[0].foods.should.be.a('array');
      response.body[0].foods[0].should.have.property('id');
      response.body[0].foods[0].id.should.equal(3);
      response.body[0].foods[0].should.have.property('name');
      response.body[0].foods[0].name.should.equal('banana');
      response.body[0].foods[0].calories.should.equal(150);
      response.body[1].name.should.equal('Snack')
      response.body[2].name.should.equal('Lunch')
      response.body[2].foods[0].name.should.equal('salad');
      response.body[3].name.should.equal('Dinner')
      response.body[3].id.should.equal(4)
      response.body[3].foods.length.should.equal(2);
      done();
    });
  }); // it should return one food

  it('should post a food to a meal', done => {
    chai.request(server)
    .post('/api/v1/meals/2/foods/1')
    .end((err, response) => {
      response.should.have.status(201);
      response.should.be.json;
      response.body.should.be.a('object');
      response.body.message.should.equal('Successfully added PIZZA to SNACK');
      done();
    });
  }); // end it should post food to meal

  it('should delete a meal food', done => {
    chai.request(server)
    .delete('/api/v1/meals/1/foods/3')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('object');
      response.body.message.should.equal('Successfully removed BANANA to BREAKFAST');
      done();
    });
  }); // end it should delete meal food

  it('should update a meal', done => {
    chai.request(server)
    .patch('/api/v1/foods/1')
    .send({ "food": {
      "name": "pepperoni pizza",
      "calories": 500
      }
    })
    .end((err, response) => {
      response.should.have.status(200)
      done();
    });
  }) // end it should update meal

  it('should get a meal with foods', done => {
    chai.request(server)
    .get('/api/v1/meals/4')
    .end((err, response) => {
      // console.log(util.inspect(response.body, false, null));
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('object');
      response.body.should.have.property('name');
      response.body.name.should.equal('Dinner');
      response.body.should.have.property('foods');
      response.body.foods.should.be.a('array');
      response.body.foods.should.have.length(2);
      response.body.foods[0].should.have.property('id');
      response.body.foods[0].id.should.equal(2);
      response.body.foods[0].should.have.property('name');
      response.body.foods[0].name.should.equal('salad');
      response.body.foods[0].calories.should.equal(100);
      response.body.foods[1].name.should.equal('pizza');
      response.body.foods[1].calories.should.equal(400);
      done();
    });
  }) // end it should get a meal with foods

}); // end of meal routes

describe('Favorite Foods', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() =>
    database('meal_foods').insert({
      food_id: 1,
      meal_id: 3
    }).then(() => done()))
  });


    it('should return favorite foods', done => {
      // add extra meal_food

      chai.request(server)
      .get('/api/v1/favorite_foods')
      .end((err, response) => {
        // console.log(util.inspect(response.body, false, null));
        response.should.have.status(200);
        response.should.be.json;
        console.log(response.body);
        response.body.should.be.a('object');
        response.body.should.have.property('timesEaten');
        response.body.name.should.equal(2);
        response.body.should.have.property('foods');
        response.body.foods.should.be.a('array');
        response.body.foods.should.have.length(2);
        response.body.foods[0].should.have.property('name');
        response.body.foods[0].name.should.equal('pizza');
        response.body.foods[0].calories.should.equal(400);
        done();
      });
    }) // end it should return favorite foods
}); // end of favorite foods routes
