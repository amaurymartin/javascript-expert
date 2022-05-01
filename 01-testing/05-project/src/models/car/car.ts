import crypto from'crypto';

import Category from './category';

class Car {
  id: string;
  category: Category;
  name: string;

  constructor(category: Category, name: string) {
    this.id = crypto.randomUUID();
    this.category = category;
    this.name = name;
  }
}

export default Car;
