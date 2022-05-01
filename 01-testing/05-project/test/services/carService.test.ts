import { join } from 'path';
import { readFile } from 'fs/promises';
import { describe, beforeEach, afterEach, it } from 'mocha';
import { expect } from 'chai';
import { createSandbox, restore, stub, useFakeTimers } from 'sinon';

import CarService from '../../src/services/carService';
import Customer from '../../src/models/customer';
import Category from '../../src/models/car/category';
import Car from '../../src/models/car/car';
import Transaction from '../../src/models/transaction';

const carsFile = join(__dirname, '../fixtures', 'cars.json');
const categoriesFile = join(__dirname, '../fixtures', 'categories.json');
const customersFile = join(__dirname, '../fixtures', 'customers.json');

describe('Car Service specs', () => {
  let carService: CarService;

  before(() => carService = new CarService());

  beforeEach(() => createSandbox());
  afterEach(() => restore());

  it('should retrieve a random index from array', async() => {
    const array = ['some', 'array', 'data'];
    const result = carService.getRandomIndexOf(array);

    expect(result).to.be.lte(array.length).and.be.gte(0);
  });

  it('should return a random car for a given category', async() => {
    const categories: Category[] = JSON.parse((await readFile(categoriesFile)).toString('utf-8'));

    const cars: Car[] = JSON.parse((await readFile(carsFile)).toString('utf-8'));
    const stubedCars = stub(carService, carService.getCars.name as any).resolves(cars);

    const randomIndex = 0;
    const carServiceGetRandomIndexOf = stub(carService, carService.getRandomIndexOf.name as any).returns(randomIndex);

    const categoryId = categories[0].id;
    const categoryCars: Car[] = JSON.parse((await readFile(carsFile)).toString('utf-8'))
      .filter((car: Car) => car.category.id === categoryId);

    const result = await carService.getAvailableCar(categoryId);
    const expected = categoryCars[randomIndex];

    expect(carServiceGetRandomIndexOf.calledOnce).to.be.ok;
    expect(stubedCars.calledOnce).to.be.ok;
    expect(result).to.be.deep.equal(expected);
  });

  it('should return the final price in BRL', async() => {
    const customers: Customer[] = JSON.parse((await readFile(customersFile)).toString('utf-8'));
    const categories: Category[] = JSON.parse((await readFile(categoriesFile)).toString('utf-8'));

    const customer = customers[0];
    customer.birthDate = new Date(new Date().getFullYear() - 50, 0, 1);

    const category = categories[0];
    category.price = 37.6;

    const numberOfDays = 5;

    const expected = CarService.currencyFormat.format(244.40);
    const result = await carService.getPriceFor(customer, category, numberOfDays);

    expect(result).to.be.deep.equal(expected);
  });

  it('should return the rent receipt', async() => {
    const customers: Customer[] = JSON.parse((await readFile(customersFile)).toString('utf-8'));
    const categories: Category[] = JSON.parse((await readFile(categoriesFile)).toString('utf-8'));

    const category = categories[0];
    const categoryCars: Car[] = JSON.parse((await readFile(carsFile)).toString('utf-8'))
      .filter((car: Car) => car.category.id === category.id);

    const stubedCars = stub(carService, carService.getCars.name as any).resolves(categoryCars);
    const stubedCar = stub(carService, carService.getAvailableCar.name as any).resolves(categoryCars[0]);

    category.price = 37.6;

    const customer = customers[0];
    customer.birthDate = new Date(new Date().getFullYear() - 50, 0, 1);

    const today = new Date(2020, 10, 5);
    useFakeTimers(today.getTime());

    const numberOfDays = 5;
    const expectedDueDate = new Date();
    expectedDueDate.setDate(today.getDate() + numberOfDays);

    const expectedPrice = CarService.currencyFormat.format(244.40);



    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;

    const expected = new Transaction(customer, categoryCars[0], expectedPrice, expectedDueDate.toLocaleDateString('pt-br', options));
    const result = await carService.rent(customer, category, numberOfDays);

    expect(result).to.be.deep.equal(expected);
  });
});
