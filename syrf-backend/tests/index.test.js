const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
  test("It should redirect to syrf.io with status code 302", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(302);
        done();
      });
  });
});