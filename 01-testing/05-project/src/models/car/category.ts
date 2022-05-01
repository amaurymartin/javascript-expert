import crypto from'crypto';

class Category {
  id: string;
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.price = price;
  }
}

export default Category;
