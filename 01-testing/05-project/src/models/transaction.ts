import Car from "./car/car";
import Customer from "./customer";

class Transaction {
  customer: Customer;
  car: Car;
  amount: string;
  numberOfDays: string;

  constructor(customer: Customer, car: Car, amount: string, numberOfDays: string) {
    this.customer = customer;
    this.car = car;
    this.amount = amount;
    this.numberOfDays = numberOfDays;
  }
}

export default Transaction;
