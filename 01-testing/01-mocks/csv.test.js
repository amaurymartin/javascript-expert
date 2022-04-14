// @ts-check
const { deepStrictEqual, rejects } = require('assert');

const Csv = require('./csv');

(async() => {
  await rejects(
    Csv.toJson('./fixtures/emptyFile.csv'),
    new Error('File length are invalid!')
  );

  await rejects(
    Csv.toJson('./fixtures/invalidFile.csv'),
    new Error('File headers are invalid!')
  );

  deepStrictEqual(
    await Csv.toJson('./fixtures/validFile.csv'),
    [
      {
        "id": "123",
        "name": "Amaury Conde",
        "role": "Javascript Student",
        "age": "27"
      },
      {
        "id": "999",
        "name": "Amaury Neto",
        "role": "Javascript Instructor",
        "age": "28"
      },
      {
        "id": "420",
        "name": "Amaury Martin",
        "role": "Javascript Specialist",
        "age": "29"
      }
    ]
  );
})();
