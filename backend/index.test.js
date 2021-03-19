const { response } = require('express');
const { get } = require('lodash');

var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3001");

describe('#indexof()', () => {
    it('should return -1 when the value is not present', () => {
        assert.equal([1, 2, 3].indexOf(5), -1)
    });
});
 
// describe('GET /api/members', function() {
//     it('should get all stats of group', function(done) {
//       get('/groups/getStats'), function(err, response, body){
//         response.statusCode.should.equal(200);        
//         done();
//       }            
//     });
//   });

  describe('GET new test', function() {
    // it('should get all stats of group', (done) =>{
    //   get('http://localhost:3000/groups/getStats')
    //   .then((response)=>{
    //     esponse.statusCode.should.equal(200);
    //     done();
    //   })    
    // });

    it("should login customer", function (done) {
        server
          .post("/users/login")
          .send({
            username: "user1@gmail.com",
            password: "Admin123"
          })
          .expect(200)
          .end(function (err, res) {
            console.log("Status: ", res.status);
            res.status.should.equal(200);
            done();
          });
      });


    // it("Should login and return a token if the credentials are correct", function (done) {
    //     chai
    //       .request('http://127.0.0.1:3001')
    //       .post("/users/login")
    //       .send({ email: "demo1@gmail.com", password: "abcd" })
    //       .end((err, res) => {
           
    //         assert(res,  null);
    //         done();
    //       });
    //   });
  });



// describe('GET users API call', () => {
//     // it('should return all emails value', async () => {
//     //     const resp = get('http://localhost:3000/users/getAllEmails');
//     //     console.log(resp);
//     //     assert.strictEqual(resp.status, "Logged in successfully");
//     // });

//     // it('should return correct value', (done) => {
//     //     get('http://localhost:3000/login').then((response)=>{
//     //         assert.strictEqual(resp.msg, "Logged in successfully");
//     //         done();
//     //     })        
//     // });
// }); 