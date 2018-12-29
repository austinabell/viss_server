// const { app } = require("../");

const url = "http://localhost:5000";
const request = require("supertest")(url);
// const assert = require('assert')

/* global describe, it */

describe("App", function() {
  it("has the default page", function(done) {
    request
      .get("/")
      .expect(/test/, done);
  });
});
