const request = require("supertest");
const app = require("../app");

describe("Exchange long lived token", () => {
  test("Should response 400 if the token is not provided", done => {
    request(app)
      .post("/facebook/token/exchange")
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe('fb_exchange_token parameter not specified');
        done();
      });
  });

  test("Should response 400 if the token is malformed", done => {
    request(app)
      .post("/facebook/token/exchange")
      .send({token: 'token'})
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.body.error.message).toBe('Invalid OAuth access token.');
        done();
      });
  });
});
