import {Directive, ElementRef} from 'angular2/angular2';

@Directive({
  selector: '.fit',
  host: {
    '(window:resize)':'onResize($event)'
  }
})

export class Fit {
  constructor(public element : ElementRef) {
    this.update();
  }

  update() {
    console.log('updating');
    let wrapper = this.element.nativeElement;
    let width = wrapper.clientWidth,
        height = wrapper.clientHeight,
        winWidth = window.innerWidth,
        winHeight = window.innerHeight;

    if (winWidth < winHeight) {
      // center vertically
      wrapper.style.width = '100%';
      let margin = (winHeight - width) / 2;
      wrapper.style.marginTop = margin;
    }

    if (winWidth >= winHeight && winHeight > 1080) {
      // center vertically
      let margin = (winHeight - width) / 2;
      wrapper.style.marginTop = margin;
    }

    if (winWidth >= winHeight && winHeight < 1080) {
      // shrink based on height
      wrapper.style.marginTop = 0;
      wrapper.style.width = winHeight;
      wrapper.style.height = winHeight;
    }
  }

  onResize(event) {
    this.update();
  }
}
