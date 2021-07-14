const request = require("supertest");
const app = require("../app");

describe("Exchange long lived token", () => {
    test("Should response 400 if the token is not provided", done => {
        request(app)
            .post("/instagram/token/exchange")
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });

    test("Should response 400 if the token is malformed", done => {
        request(app)
            .post("/instagram/token/exchange")
            .send({ token: 'token' })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
});

describe("Refresh long-lived token", () => {
    test("Should response 400 if the token is malformed", done => {
        request(app)
            .post("/instagram/token/refresh")
            .send({ token: 'token' })
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });

    test("Should response 400 if the token is not provided", done => {
        request(app)
            .post("/instagram/token/refresh")
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
});

describe("Exchange code for token", () => {
    test("Should response 400 if the code is malformed", done => {
        request(app)
            .post("/instagram/token")
            .send({ code: 'token' })
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body.error_message).toBe('Invalid authorization code');
                done();
            });
    });

    test("Should response 400 if the code is not provided", done => {
        request(app)
            .post("/instagram/token")
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body.error_message).toBe('Invalid authorization code');
                done();
            });
    });
});