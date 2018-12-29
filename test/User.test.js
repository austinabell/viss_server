/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { expect } from "chai";

// const expect = _expect;
const url = "http://localhost:5000";
const request = require("supertest")(url);

describe("User model", function() {
  this.timeout(15000);

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

        expect(res.body.data.login).to.have.property("id");
        expect(res.body.data.login).to.have.property("name");
        done();
      });
  });

  it("Gets the logged in user's data", (done) => {
    request
      .post("/graphql")
      .send({ query: "{ me { id, name, username, email } }" })
      .set({ "cookie": cookie })
      .expect(200)
      .end((err, res) => {
        // res will contain array of all users
        if (err) return done(err);

        expect(res.body.data.me).to.have.property("id");
        expect(res.body.data.me).to.have.property("name");
        expect(res.body.data.me).to.have.property("username");
        expect(res.body.data.me).to.have.property("email");
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
