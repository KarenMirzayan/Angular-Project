  import { Component, OnInit } from '@angular/core';
  import { ProductService } from '../services/product.service';
  import { ProductCardComponent } from '../product-card/product-card.component';
  import { CommonModule } from '@angular/common';
  import {ActivatedRoute} from "@angular/router";
  import {Observable} from "rxjs";
  import {CategoryService} from "../services/category.service";

  @Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
  })
  export class ProductListComponent implements OnInit {
    products$: Observable<any[]> | undefined;
    id: string = ''

    category: string = ''

    constructor(private productService: ProductService, private categoryService: CategoryService,private route: ActivatedRoute) {}
    ngOnInit(): void {
      let id = this.route.snapshot.params['id'];
      if (id === undefined) {
        this.getAllProducts()
        this.category = "All Products"
      }
      else {
        this.getCategory(id)
      }
    }

    getAllProducts() {
      this.products$ = this.productService.getProducts();
    }

    getCategory(id: string) {
      this.products$ = this.productService.getCategory(id);
      this.categoryService.getCategoryById(id).subscribe(category => {
        this.category = category.name
      })
    }
  }
