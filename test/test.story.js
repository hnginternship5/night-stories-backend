const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app.js');
chai.use(chaiHttp);
require('chai/register-should');

// TESTS

// Test to view story
describe('It should get the stories', () => {
    it('should get all the Stories from db', (done) => {
        chai
            .request(app)
            .get('/api/v1/story/')
            .end((err, res) => {
                res.should.have.property("status", 200);
            done()
            })
        });
})            

// Test to get single story
describe('It should test for getting single stories', () => {
    it('should get a single story ', (done) => {
        const storyId = 0;
        chai
            .request(app)
            .get(`/api/v1/story/stories/${storyId}`)
            .end((err, res) => {
                // Because there is no value in the database
                res.should.have.property('status', 404)
                res.body.should.be.a('object');
            done();    
            })
        })

    it('should not get a story with wrong id', (done) => {
        const storyIda = 'a';
        chai
            .request(app)
            .get(`/api/v1/story/stories/${storyIda}`)
            .end((err, res) => {
                res.should.have.property('status', 404);
                res.body.should.be.a('object');
            done()    
            })
    })    
})