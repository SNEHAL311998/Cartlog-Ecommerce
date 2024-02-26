import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
  slides: any[] = new Array(3).fill({id: -1, src: '', title: '', subtitle: ''});

  constructor() { }

  ngOnInit(): void {
    this.slides[0] = {
      src: '../../../assets/carousel/banner (1).jpg'
    };
    this.slides[1] = {
      src: '../../../assets/carousel/banner (2).jpg'
    };
    this.slides[2] = {
      src: '../../../assets/carousel/banner (3).jpg'
    };
    this.slides[3] = {
      src: '../../../assets/carousel/banner (4).jpg'
    };
    this.slides[4] = {
      src: '../../../assets/carousel/banner (5).jpg'
    };
    this.slides[5] = {
      src: '../../../assets/carousel/banner (6).jpg'
    };
    this.slides[6] = {
      src: '../../../assets/carousel/banner (7).jpg'
    };
    this.slides[7] = {
      src: '../../../assets/carousel/banner (8).jpg'
    };
  }
}
