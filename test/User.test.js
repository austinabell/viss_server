/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { expect } from "chai";
import { User } from "../src/models";

// const expect = _expect;
const url = "http://127.0.0.1:5001";
const request = require("supertest")(url);

import { startServer } from "../src/startServer";

describe("User model", function() {
  this.timeout(15000);

  before(async function() {
    await startServer();
  });

  const name = "Test User";
  const email = "testing12345@gmail.com";
  const password = "Testing12345";

  let cookie = "";
  it("Create user", (done) => {
    request
      .post("/graphql")
      .send({
        query: `mutation { 
          signUp(
            name: "${name}",
            email: "${email}", 
            password: "${password}") { 
            id, email, name 
          }
        }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.errors).to.eq(undefined);
        done();
      });
  });

  it("Finds user correctly", (done) => {
    User.findOne({ email })
      .then((user) => {
        expect(user.email).to.eq(email);
        done();
      })
      .catch((e) => done(e));
  });

  it("Logs in correctly", (done) => {
    request
      .post("/graphql")
      .send({
        query: `mutation { login(email: "${email}", password: "${password}") { id, email } }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        if (res.headers["set-cookie"]) {
          cookie = res.headers["set-cookie"];
        }

        expect(res.body.data.login).to.have.property("id");
        expect(res.body.data.login).to.have.property("email");
        // expect(res.body.data.login.email).to.eq(email);
        done();
      });
  });

  it("Gets the logged in user's data", (done) => {
    request
      .post("/graphql")
      .send({ query: "{ me { id, name, email } }" })
      .set({ cookie })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.data.me).to.have.property("id");
        expect(res.body.data.me).to.have.property("name");
        expect(res.body.data.me).to.have.property("email");
        done();
      });
  });

  it("Deletes the user", (done) => {
    request
      .post("/graphql")
      .send({ query: "mutation { deleteAccount }" })
      .set({ cookie })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.data.deleteAccount).to.equal(true);
        done();
      });
  });
});
