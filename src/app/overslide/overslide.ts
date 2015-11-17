import {Output, EventEmitter, Directive, Component, View, bootstrap, CORE_DIRECTIVES, Renderer, ElementRef} from 'angular2/angular2';
import {Insta} from '../insta/insta';
import {Fit} from '../fit/fit';

class Overlay {
  svg : string = '';
  color : string = '';
}

@Component({
  selector: 'overslide',
  properties: ['transition']
})

@View({
  templateUrl: 'app/overslide/overslide.html',
  directives: [CORE_DIRECTIVES, Fit]
})

export class Overslide {
  queue : string[];
  newQueue : string[];
  queueIndex : number;
  newIndex : number;
  overlayIndex : number;
  overlayNextIndex : number;
  currentImage : string;
  currentOverlay : Overlay;
  nextImage : string;
  nextOverlay : Overlay;
  overlays : Overlay[];
  loaded : Boolean;
  trans : Boolean;
  onNew : Boolean;
  updateInterval : number;
  rotateInterval : number;

  constructor(
    public Insta : Insta
  ) {
    this.overlays = [
      {svg: 'assets/overlays/blue-square.svg', color: 'blue'},
      {svg: 'assets/overlays/red-circle.svg', color: 'red'},
      {svg: 'assets/overlays/yellow-triangle.svg', color: 'yellow'}
    ]
    this.queue = [];
    this.newQueue = [];
    this.queueIndex = 0;
    this.newIndex = 0;
    this.nextImage = '';
    this.currentImage = '';
    this.overlayIndex = 0;
    this.overlayNextIndex = 0;
    this.loaded = false;
    this.trans = false;
    this.onNew = false;
    this.main();
    //Renderer.setElementStyle(element, 'opacity', '.1');
  }

  main() {
    this.setInterval();
  }

  reset() {
    this.queue = [];
    this.newQueue = [];
    this.queueIndex = 0;
    this.newIndex = 0;
    this.nextImage = '';
    this.currentImage = '';
    this.overlayIndex = 0;
    this.overlayNextIndex = 0;
    this.loaded = false;
    this.trans = false;
    this.onNew = false;
    clearInterval(this.updateInterval);
    clearInterval(this.rotateInterval);
    this.setInterval();
  }

  newTag(tag) {
    console.log('New tag: ' + tag)
    this.Insta.newTag(tag);
    this.reset();
  }

  setInterval() {
    let __this = this;
    this.updateInterval = setInterval(function() {
      __this.update();
    }, 5000);
    this.rotateInterval = setInterval(function() {
      __this.nextSlide();
    }, 1000);
  }

  getNewInsta() {
    return this.Insta.data.slice(this.queue.length, this.Insta.data.length)
      .map((item) => item.images.high_resolution.url);
  }

  update() {
    console.log('Updating');
    if (this.queue.length < this.Insta.data.length) {
      let newData = this.getNewInsta();
      if (!this.loaded) {
        this.queue = this.queue.concat(newData);
        this.loaded = true;
        return;
      }
      this.newQueue = this.newQueue.concat(newData);
      this.queue = this.queue.concat(newData);
    }
  }

  nextSlide() {
    if (this.onNew) {
      this.newQueue.shift();
      this.onNew = false;
    }
    if (this.newQueue.length > 0) {
      console.log('From new: 1 of ' + this.newQueue.length);
      this.onNew = true;
      this.nextImage = this.newQueue[0];
    }
    else {
      this.queueIndex = this.queueIndex+1 < this.queue.length ? this.queueIndex+1 : 0;
      this.nextImage = this.queue[this.queueIndex];
      console.log('From queue: ' + this.queueIndex + ' of ' + this.queue.length);
    }
    this.overlayNextIndex
    this.trans = true;
    setTimeout(() => {
      this.currentOverlay = this.nextOverlay;
      this.currentImage = this.nextImage;
      // update indexes
      this.overlayIndex = this.overlayNextIndex;
      this.overlayNextIndex = this.overlayNextIndex+1 < this.overlays.length ? this.overlayNextIndex+1 : 0;
      this.trans = false;
    }, 10);
  }

  showButton(button) {
    button.style.opacity = '1';
  }

  hideButton(button) {
    button.style.opacity = '0';
  }

  toggleDash(dashboard) {
    dashboard.style.display = dashboard.style.display === 'block' ? 'none' : 'block';
  }
}
