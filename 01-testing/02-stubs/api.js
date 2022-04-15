// @ts-check
const https = require('https');

const BASE_URL = 'https://swapi.dev/api';

class Api {
  async get(resource) {
    return new Promise((resolve, reject) => {
      https.get(`${BASE_URL}${String(resource)}`, (response) => {
        response.on('data', (data) => resolve(JSON.parse(data)));
        response.on('error', reject);
      });
    });
  }

  async getPlanet(planetId) {
    const planetData = await this.get(`/planets/${String(planetId)}`);

    return {
      name: planetData.name,
      surfaceWater: planetData.surface_water,
      filmsCount: planetData.films.length,
    };
  }
}

// (async () => {
  //   const response = await new Api().get('https://swapi.dev/api/planets/1');
  //   // console.log('response', response);
  // })();

  module.exports = Api;
