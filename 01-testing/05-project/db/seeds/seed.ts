import { join } from 'path';
import { writeFile } from 'fs/promises';
import { faker } from '@faker-js/faker';

import Category from '../../src/models/car/category';
import Car from '../../src/models/car/car';
import Customer from '../../src/models/customer';

const baseFolder = join(__dirname, '../', '../', 'test', 'fixtures');

const Seed = (async() => {
const categories = [
  new Category(faker.vehicle.type(), Number(faker.finance.amount(0.01, 4200))),
  new Category(faker.vehicle.type(), Number(faker.finance.amount(0.01, 4200))),
];

const cars = [];
for(const category of categories) {
  for(const i of [0, 1, 2]) {
    cars.push(new Car(category, faker.vehicle.model()));
  }
}

const customers = [];
for(const i of [1, 2]) {
  customers.push(
    new Customer(faker.name.findName(), faker.date.past(i * 42))
  );
}

const write = async (filename: string, data: Object) => {
  await writeFile(join(baseFolder, filename), JSON.stringify(data));
}

await write('categories.json', categories);
await write('cars.json', cars);
await write('customers.json', customers);
})();

export default Seed;
