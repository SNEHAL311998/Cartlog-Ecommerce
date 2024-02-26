import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/service/testapi.service';

@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.scss'],
})
export class LatestComponent {
  latestData: any;

  constructor(private apiService: ApiService) {
    this.latestData;
  }

  ngOnInit() {
    forkJoin([
      this.apiService.getMensProduct(),
      this.apiService.getWomensProduct(),
    ]).subscribe(
      ([mensData, womensData]) => {
        this.latestData = [...mensData.slice(-4), ...womensData.slice(-4)];
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
