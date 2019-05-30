//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var request = require('supertest');


var server = require('../server/server.js');
var servertools = require('../server/servertools');



chai.use(chaiHttp);


//parent block
describe('Run tests', function () {

    //using an async function here to make sure execution halts until a connection is made
    it('should connect first', async function () {
        await servertools.connect().then(function () {
            console.log("db connected");

            beforeEach(async () => {
                var res = await chai.request(server).post('/words.json').set('content-type', 'application/json').send({ words: ["read", "dear", "dare"] })
                res.should.have.status(201);
            });

            afterEach(async () => {
                var res = await chai
                    .request(server)
                    .delete('/words.json')
                res.should.have.status(204);
            });


            describe('test_fetching_anagrams', () => {
                it('should receive all words inserted ["read", "dear", "dare"]', (done) => {
                    chai
                        .request(server)
                        .get('/anagrams/read.json')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body["anagrams"].length.should.be.eql(3);
                            res.body["anagrams"].sort().should.be.eql(["dare", "dear", "read"]);
                            done();
                        });
                });
            });


            describe('test_fetching_anagrams_with_limit', () => {
                it('should receive 1 word from the database', (done) => {
                    chai
                        .request(server)
                        .get('/anagrams/read.json?limit=1')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body["anagrams"].length.should.be.eql(1);
                            done();
                        });
                });

            })//end of 'test_fetching_anagrams_with_limit


            describe('test_fetch_for_word_with_no_anagrams', () => {
                it('should receive an empty json array', (done) => {
                    chai
                        .request(server)
                        .get('/anagrams/zyxwv.json')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body["anagrams"].length.should.be.eql(0);
                            done();
                        })
                })
            })
        })

        describe('test_deleting_all_words', () => {

            it('should return a 204', function (done) {
                request(server).delete('/words.json').expect(204, function () {
                    request(server).get('/anagrams/read.json')
                        .expect(200)
                        .end((err, res) => { res.body["anagrams"].should.be.eql(0), done })
                })
            }

            )
        })

    })
})