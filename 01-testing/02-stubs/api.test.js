// @ts-check
const { deepStrictEqual, rejects } = require('assert');
const sinon = require('sinon');

const Api = require('./api');

const BASE_URL = 'https://swapi.dev/api';
const PLANETS_RESOURCE = '/planets';

const mocks = {
  tatooine: require('./fixtures/tatooine.json'),
  alderaan: require('./fixtures/alderaan.json'),
};

(async () => {
  const api = new Api();
  // const unstub = await api.get(`${BASE_URL}/${PLANETS_RESOURCE}/1`);
  // console.log(JSON.stringify(unstub));

  // @ts-ignore
  const stub = sinon.stub(api, api.get.name);

  stub.withArgs(`${PLANETS_RESOURCE}/1`).resolves(mocks.tatooine);
  stub.withArgs(`${PLANETS_RESOURCE}/2`).resolves(mocks.alderaan);

  deepStrictEqual(
    await api.getPlanet(1),
    {
      "name": "Tatooine",
      "surfaceWater": "1",
      "filmsCount": 5,
    }
  );

  deepStrictEqual(
    await api.getPlanet(2),
    {
      "name": "Alderaan",
      "surfaceWater": "40",
      "filmsCount": 2,
    }
  );
})();
