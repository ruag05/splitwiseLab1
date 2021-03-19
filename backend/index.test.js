const { response } = require('express');
const { get } = require('lodash');

var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3001");

let chai = require('chai');
let assert = require('chai').assert;
let expect = require('chai').expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

const mysql = require('mysql');

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin"
});

con.connect((err) => {
  if (err) {
    console.log("error connecting: " + err);
    return;
  }
  console.log("Connection established");
})

describe('Test indexof()', () => {
  it('should return -1 when the value is not present', () => {
    assert.equal([1, 2, 3].indexOf(5), -1)
  });
});

describe('POST: Test login1', function () {
  it("should login customer", async () => {
    const result = await server
      .post("/users/login")
      .send({
        username: "user1@gmail.com",
        password: "Admin123"
      })
      .then(function (res) {
        expect(res.text).to.equal('{"message":"Invalid credentials!"}');
      })
      .catch((error) => {
        console.log(error);
      })
  });
});
  
describe("POST: Test Login2", function (){
  it("Should login if the credentials are correct", function (done) {
    chai
      .request("http://localhost:5000/")
      .post("users/login")
      .send({ email: "user1@gmail.com", password: "Admin123" })      
      .end((res, err) => {
        console.log("Res is: "+res);
        // expect(JSON.parse(res)).to.have.status(200);
        assert(res.msg, "Logged in successfully");
        done();
      });
  });
});