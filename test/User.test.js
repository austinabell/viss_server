/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const chai = require("chai");

const expect = chai.expect;
const url = "http://localhost:5000";
const request = require("supertest")(url);

describe("User model", () => {
  let cookie = "";
  it("Create user", (done) => {
    request
      .post("/graphql")
      .send({
        query:
          "mutation { signUp(email: \"testing123@gmail.com\", password: \"Testing123\") { id, email, name }}"
      })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        
        // res.body.data.signUp.should.have.property("id");
        // res.body.user.should.have.property("email");
        // res.body.user.should.have.property("name");

        cookie = res.headers["set-cookie"];
        done();
      });
  });

  it("Logs in correctly", (done) => {
    request
      .post("/graphql")
      .send({ query: "mutation { login(email: \"testing123@gmail.com\", password: \"Testing123\") { id, name } }" })
      .expect(200)
      .end((err, res) => {
        // res will contain array of all users
        if (err) return done(err);
        
        if (res.headers["set-cookie"]){
          cookie = res.headers["set-cookie"];
        }
        // res.body.data.login.should.have.property("id");
        // res.body.data.login.should.have.property("name");
        done();
      });
  });

  it("Deletes the user", (done) => {
    request
      .post("/graphql")
      .send({ query: "mutation { deleteAccount }" })
      .set({ "cookie": cookie })
      .expect(200)
      .end((err, res) => {
        // res will contain array of all users
        if (err) return done(err);

        expect(res.body.data.deleteAccount).to.equal(true);
        done();
      });
  });
});
