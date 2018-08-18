const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database('foods').del().then(() =>
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
  });

  it('should delete one food', done => {
    chai.request(server)
    .delete('/api/v1/foods/1')
    .end((err, response) => {
      response.should.have.status(204);

      done();
    });
  });

  it('should return a 404 if no food to delete', done => {
    chai.request(server)
    .delete('/api/v1/foods/3')
    .end((err, response) => {
      response.should.have.status(404);

      done();
    });
  });

});
