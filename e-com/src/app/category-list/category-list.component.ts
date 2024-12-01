import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    // Fetch categories from the service
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
      console.log('Categories:', this.categories); // Debugging
    });
  }
}
