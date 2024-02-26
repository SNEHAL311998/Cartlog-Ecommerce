import { Component, ViewEncapsulation } from '@angular/core';
import { LoaderService } from 'src/service/loader.service';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class LoaderComponent {
  constructor(
    public loaderService: LoaderService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    const isLoading = this.loaderService.getLoading();
    console.log(isLoading);
    if (isLoading) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll');
  }
}
