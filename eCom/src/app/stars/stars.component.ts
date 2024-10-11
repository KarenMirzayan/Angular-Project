import {Component, Input} from '@angular/core';
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [
    CommonModule, FontAwesomeModule,
  ],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.css'
})
export class StarsComponent {
  faStar = faStar;
  faStarEmpty = faStarEmpty;
  @Input() stars: number = 0;

  get filledStars(): number[] {
    return Array(Math.floor(this.stars)).fill(0);
  }

  get emptyStars(): number[] {
    return Array(5 - Math.floor(this.stars)).fill(0);
  }

}
