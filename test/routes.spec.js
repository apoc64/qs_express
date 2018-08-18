const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
// const environment = process.env.NODE_ENV || 'development';
// const configuration = require('../knexfile')[environment];
// const database = require('knex')(configuration);

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
  database('foods').insert({
    name: "banana",
    calories: 150
  });

  chai.request(server)
  .get('/')
  .end((err, response) => {
    response.should.have.status(200);
    response.should.be.json;
    response.body.should.be.a('array');
    response.body.length.should.equal(1);
    response.body[0].should.have.property('name');
    response.body[0].title.should.equal('banana');
    response.body[0].should.have.property('calories');
    response.body[0].title.should.equal(150);
    done();
  });
  // when I send a request to: GET /api/v1/foods
  // I get all the foods in the database
  // Foods look like:
  //
  // {
  // "id": 1,
  // "name": "Banana",
  // "calories": 150
  // },
});
