export class Item {
  name: string;
  description: string;
  image: string;
  short_description: string;
  price: number;
  category: string;
  stars: number;
  reviews: number;
  static categories: string[] = ['Food', 'Clothes', 'Electronics'];

  constructor(name: string, price?: number, category?: string, image?: string) {
    this.image = image ?? '';
    this.name = name;
    this.description =
      'This is ' +
      this.name +
      ". His description can be complex and large, but for tests sake it's like this.";
    this.short_description = 'Short description for this product';
    this.price = price !== undefined ? price : Math.floor(Math.random() * 200);
    this.category =
      category !== undefined
        ? category
        : Item.categories[Math.floor(Math.random() * Item.categories.length)];
    this.stars = Math.floor(Math.random() * 5) + 1;
    this.reviews = Math.floor(Math.random() * 100);
  }
}
