import { join } from 'path';
import { readFile } from 'fs/promises';

import Car from '../models/car/car';
import Category from '../models/car/category';
import Customer from '../models/customer';
import Tax from '../models/tax';
import Transaction from '../models/transaction';

const FILE_PATH = join(__dirname, '../../test/fixtures', 'cars.json');

class CarService {
  static get currencyFormat() {
    return new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });
  }

  static get dateFormat() {
    return { year: 'numeric', month: 'long', day: 'numeric' } as const;
  }

  async getAvailableCar(categoryId: string): Promise<Car> {
    const categoryCars = (await this.getCars())
      .filter((car) => car.category.id === categoryId);

    return categoryCars[this.getRandomIndexOf(categoryCars)];
  }

  async getPriceFor(customer: Customer, category: Category, numberOfDays: number): Promise<string> {
    const customerAge = new Date(Date.now() - customer.birthDate.getTime()).getFullYear() - 1970;

    const tax = Tax.taxByAge.find((range) => customerAge >= range.from && customerAge <= range.to);
    const price = (tax?.then || 0) * category.price * numberOfDays;

    return CarService.currencyFormat.format(price);
  }

  async rent(customer: Customer, category: Category, numberOfDays: number): Promise<Transaction> {
    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);


    const car = await this.getAvailableCar(category.id);
    const price = await this.getPriceFor(customer, category, numberOfDays);
    const dueDate = today.toLocaleDateString('pt-br', CarService.dateFormat);

    return new Transaction(customer, car, price, dueDate);
  }

  async getCars(): Promise<Car[]> {
    return JSON.parse((await readFile(FILE_PATH)).toString('utf-8'));
  }

  getRandomIndexOf(array: any[]) {
    return Math.floor(Math.random() * array.length);
  }
}

export default CarService;
