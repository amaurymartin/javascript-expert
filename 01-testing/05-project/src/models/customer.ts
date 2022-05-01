import crypto from'crypto';

class Customer {
  id: string;
  name: string;
  birthDate: Date;

  constructor(name: string, birthDate: Date) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.birthDate = birthDate;
  }
}

export default Customer;
