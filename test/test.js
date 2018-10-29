const request = require("supertest");
const app = require("../");
const assert = require("assert");

describe("App", function() {
  it("has the default page", function(done) {
    request(app)
      .get("/")
      .expect(/test/, done);
  });
});