const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../src/app');
chai.use(chaiHTTP);
require('chai/register-should');

//USER TESTS
const newUser = {
    name: 'Adesanya Adetomiwa',
    email: 'paul@gmail.com',
    designation: 'blah blah',
    is_admin: 'true',
    is_premium: 'true',
    password: 'bluwaters'
}
const badUser = {
    email: 'wiz@gmail.com',
    designation: 'blah blah',
    is_admin: 'true',
    is_premium: 'true',
    password: 'bluwaters'
}


//Register User
describe('it should register new user', () => {
    it('should create new user', (done) => {
        chai
          .request(app)
          .post('/api/v1/user/register')
          .send(newUser)
          .end((err, res) => {
              res.should.have.property('status', 200);
              res.body.should.be.a('object');
              res.body.data.should.have.property('id');
              res.body.data.should.have.property('name');
              res.body.data.should.have.property('email');
              res.body.data.should.have.property('admin');
              res.body.data.should.have.property('premium');
           done();
          })
    });
    it('should not register a user twice', (done) => {
        chai
          .request(app)
          .post('/api/v1/user/register')
          .send(newUser)
          .end((err, res) => {
              res.should.have.property('status', 409);
           done();
          })
    });
    it('should not register without complete information', (done) => {
        chai
          .request(app)
          .post('/api/v1/user/register')
          .send(badUser)
          .end((err, res) => {
              res.should.have.property('status', 400);
          done();  
          });
    });
});

// Login User 
