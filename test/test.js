const { app } = require("../");
const request = require("supertest");
// const assert = require('assert')

/* global describe, it */

describe("App", function() {
  it("has the default page", function(done) {
    request(app)
      .get("/")
      .expect(/test/, done);
  });
});
