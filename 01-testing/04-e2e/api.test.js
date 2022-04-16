// @ts-check
const { deepStrictEqual, ok } = require('assert');
const { describe, it } = require('mocha');
const request = require('supertest');

const api = require('./api');

describe('API Test Suite', () => {
  describe('/contact', () => {
    it('should request contact us page with success', async() => {
      const response = await request(api).get('/contact').expect(200);

      deepStrictEqual(response.text, 'Contact us');
    });
  });

  describe('/random-route', () => {
    it('should be redirect to root', async() => {
      const response = await request(api).get('/random-route').expect(200);

      deepStrictEqual(response.text, 'OK');
    });
  });

  describe('/signin', () => {
    it('should be logged in successfully', async() => {
      const response = await request(api)
        .post('/signin')
        .send({ email: 'foo@bar.com', password: 'foobar' })
        .expect(200);

      deepStrictEqual(response.text, 'Authenticated');
    });

    it('should not be logged in with wrong credentials', async() => {
      const response = await request(api)
        .post('/signin')
        .send({ email: 'invalid', password: '' })
        .expect(401);

      ok(response.unauthorized);
      deepStrictEqual(response.text, 'Unauthorized');
    });
  });
});
