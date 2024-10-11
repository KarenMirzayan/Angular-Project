export class Item {
  name: string;
  description: string;
  short_description: string;
  price: number;
  category: string;
  stars: number;
  reviews: number;
  static categories: string[] = ["Food", "Clothes", "Electronics"]
  constructor(name: string) {
    this.name = name;
    this.description = "This is" + this.name + ". His description can be complex and large, but for tests sake it's like this.";
    this.short_description = "Short description for this product";
    this.price = Math.floor(Math.random() * 200);
    this.category = Item.categories[Math.floor(Math.random() * Item.categories.length)];
    let x = (Math.random() * 5 + 1)
    this.stars = Math.floor(x > 5 ? 5 : x);
    this.reviews = Math.floor(Math.random() * 100);
  }
}
