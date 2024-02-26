import { Component } from '@angular/core';

@Component({
  selector: 'app-topbrands',
  templateUrl: './topbrands.component.html',
  styleUrls: ['./topbrands.component.scss']
})
export class TopbrandsComponent {
  allBrands:any=[
    {
      "title":"Men's",
      "brands":[
        {
          src:'../../../assets/brands/mens (1).jpg'
        },
        {
          src:'../../../assets/brands/mens (2).jpg'
        },
        {
          src:'../../../assets/brands/mens (3).jpg'
        },
        {
          src:'../../../assets/brands/mens (4).jpg'
        },
        {
          src:'../../../assets/brands/mens (5).jpg'
        },
        {
          src:'../../../assets/brands/mens (6).jpg'
        },
        {
          src:'../../../assets/brands/mens (7).jpg'
        },
        {
          src:'../../../assets/brands/mens (8).jpg'
        },
      ]
    },
    {
      "title":"Women's",
      "brands":[
        {
          src:'../../../assets/brands/women (1).jpg'
        },
        {
          src:'../../../assets/brands/women (2).jpg'
        },
        {
          src:'../../../assets/brands/women (3).jpg'
        },
        {
          src:'../../../assets/brands/women (4).jpg'
        },
        {
          src:'../../../assets/brands/women (5).jpg'
        },
        {
          src:'../../../assets/brands/women (6).jpg'
        },
        {
          src:'../../../assets/brands/women (7).jpg'
        },
        {
          src:'../../../assets/brands/women (8).jpg'
        },
      ]
    }
  ]
  // mensList:any=
  // womensList:any=
}
