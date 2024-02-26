import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/service/testapi.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
})
export class FeaturedComponent {
  featuredData: any;

  constructor(private apiService: ApiService) {
    this.featuredData;
  }

  ngOnInit() {
    // Make two API requests in parallel and combine the data
    forkJoin([
      this.apiService.getMensProduct(),
      this.apiService.getWomensProduct(),
    ]).subscribe(
      ([mensData, womensData]) => {
        this.featuredData = [
          ...mensData.slice(0, 4),
          ...womensData.slice(0, 4),
        ];
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

}
