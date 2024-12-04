import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {CarouselModule} from "primeng/carousel";

@Component({
  selector: 'app-promo-gallery',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CommonModule,
    CarouselModule,
  ],
  templateUrl: './promo-gallery.component.html',
  styleUrl: './promo-gallery.component.css',
})
export class PromoGalleryComponent implements OnInit{
  items: GalleryImage[] = [
    {
      id: 1,
      img: "https://us.laneige.com/cdn/shop/files/16x9_Left_e7f22e8a-fb98-4719-a6fc-d13c26ef27c5.jpg?height=650&v=1733249553&width=1550",
      h1: "FREE Holographic Pouch",
      p: "Score a treat for yourself when you purchase any 2 holiday sets"
    },
    {
      id: 2,
      img: "https://us.laneige.com/cdn/shop/files/1920x1080_HP_Banner_Neo_Powder_NP_b.jpg?height=650&v=1732649438&width=1550",
      h1: "NEO BLURRING POWDER",
      p: "Just landed—the viral K-Beauty powder to absorb oil, blur, & smooth"
    },
    {
      id: 3,
      img: "https://us.laneige.com/cdn/shop/files/1920x1080_HP_Banner_LE_Holiday_Sets.jpg?height=650&v=1730405089&width=1550",
      h1: "SKIN SO BEAMING. AURA SO BRIGHT.",
      p: "Manifest glow with skincare gifts by Laneige"
    }
  ]

  currentIndex = 0;
  translateX = 0;

  constructor(){}

  ngOnInit(): void {
    this.updateTransform();
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateTransform();
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateTransform();
  }

  private updateTransform(): void {
    this.translateX = -this.currentIndex * 100;
  }

  travel(id: number) {
    console.log(`Redirect to product with id: ${id}`);
    // Implement your navigation or logic to redirect to product page
  }

  bgimage(url: string) {
    return `background-image: url(${url})`;
  }
}

interface GalleryImage {
  id: number,
  img: string,
  h1: string,
  p: string,

}
