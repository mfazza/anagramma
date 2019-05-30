//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();


var server = require('../server/server.js');
var servertools = require('../server/servertools');



chai.use(chaiHttp);


//parent block
describe('Run tests', function () {

    //using an async function here to make sure execution halts until a connection is made
    it('should connect first', async function () {
        await servertools.connect().then(function () {
            console.log("db connected");

            //
            beforeEach((done) => { //Before each test we empty the database
                chai
                    .request(server)
                    .post('/words.json')
                    .set('content-type', 'application/json')
                    .send({ words: ["read", "dear", "dare"] })
                    .end((err, res) => {
                        res.should.have.status(201);
                        done();
                    })
            });

            afterEach((done) => {
                chai
                    .request(server)
                    .delete('/words.json')
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    })
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
            it('should fetch an empty body', function () {
                return chai
                    .request(server)
                    .delete('/words.json')
                    .then(function (response) {
                        response.should.have.status(204);
                        return chai
                            .request(server)
                            .get('/anagrams/read.json')
                            .then(function (res) {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body["anagrams"].length.should.be.eql(0);
                            }, function (err) {
                                console.log(err);
                            })
                    }, function (error) { console.log(error); })
            })




        })
    })
})