const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');

const should = chai.should();

chai.use(chaiHttp);

describe('Boards', () => {
  describe('/POST board', () => {
    it('it should not POST a board without boardName field', (done) => {
      const board = {
      };
      chai.request(server)
        .post('/test')
        .send(board)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });

    it('it should POST a board ', (done) => {
      const board = {
        boardName: 'Some board',
      };
      chai.request(server)
        .post('/test')
        .send(board)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('boardName').eql('Some board');
          done();
        });
    });
  });

  describe('/GET boards', () => {
    it('it should GET all boards', (done) => {
      chai.request(server)
        .get('/test')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });
});
