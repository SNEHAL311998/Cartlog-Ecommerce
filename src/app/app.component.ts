import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cartlog';

  scrollPositionToShowButton = 1000;
  isScrollButtonVisible = false;

  constructor() {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Detect when the user scrolls and show/hide the button accordingly
    const scrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;
    this.isScrollButtonVisible = scrollY > this.scrollPositionToShowButton;
  }

  scrollToTop() {
    // Scroll to the top of the page when the button is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
