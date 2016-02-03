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
  totalReceived : number;
  preloaded : Boolean;
  loaded : Boolean;
  trans : Boolean;
  onNew : Boolean;
  updateInterval : number;
  rotateInterval : number;

  constructor(
    public Insta : Insta
  ) {
    this.overlays = [
      {svg: 'assets/overlays/NarcoSystem_Overlays_FINAL_RED_1.svg', color: 'red'},
      {svg: 'assets/overlays/NarcoSystem_Overlays_FINAL_YELLOW_2.svg', color: 'yellow'},
      {svg: 'assets/overlays/NarcoSystem_Overlays_FINAL_BLUE_3.svg', color: 'blue'}
    ];
    this.queue = [];
    this.newQueue = [];
    this.queueIndex = 0;
    this.newIndex = 0;
    this.nextImage = '';
    this.currentImage = '';
    this.overlayIndex = 0;
    this.overlayNextIndex = 0;
    this.totalReceived = 0;
    this.preloaded = false;
    this.loaded = false;
    this.trans = false;
    this.onNew = false;
    this.main();
  }

  // unused
  addOverlays() {
    var colorNum = 0;
    for (let o = 1; o <= 30; o++ ) {
      var color = '';
      switch (colorNum) {
        case 0: color = 'red'; break;
        case 1: color = 'yellow'; break;
        case 2: color = 'blue'; break;
      }
      let overlay = {
        svg: 'assets/overlays/NARCO_Overlays_AlteringOrder_' + o + '.svg',
        color: color
      }
      this.overlays.push(overlay);
      console.log(overlay);
      colorNum = colorNum === 2 ? 0 : colorNum+1;
    }
  }

  main() {
    this.update();
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
    this.preloaded = false;
    this.loaded = false;
    this.trans = false;
    this.onNew = false;
    this.totalReceived = 0;
    clearInterval(this.updateInterval);
    clearInterval(this.rotateInterval);
    this.update();
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
    }, 1000);
    this.rotateInterval = setInterval(function() {
      __this.nextSlide();
    }, 100);
  }

  getNewInsta() {
    return this.Insta.data.slice(this.totalReceived, this.Insta.data.length)
      .map((item) => item.images.high_resolution.url);
  }

  update() {
    if (this.queue.length < this.Insta.data.length) {
      console.log('Updating');
      let newData = this.getNewInsta();
      this.totalReceived += newData.length;
      if (!this.preloaded) {
        this.queue = this.queue.concat(newData);
        this.preloaded = true;
        //return;
      }
      console.log('Got ' + newData.length + ' from Insta');
      console.log('Have ' + this.totalReceived + ' total');
      this.newQueue = this.newQueue.concat(newData);
      this.queue = this.queue.concat(newData);
      if (this.totalReceived >= 40) {
        this.loaded = true;
      }
      if (this.queue.length >= 1000) {
        // cut queue in half
        this.queue = this.queue.splice(500, this.queue.length);
        if (this.queueIndex <= 500) {
          // set index to 0
          this.queueIndex = 0;
        }
        else {
          // set index to current - half
          this.queueIndex = this.queueIndex - 500;
        }
      }
    }
  }

  nextSlide() {
    if (this.onNew) {
      this.newQueue.shift();
      this.onNew = false;
    }
    if (this.newQueue.length > 40) {
      this.onNew = true;
      this.nextImage = this.newQueue[0];
    }
    else if (this.queue.length > 40) {
      this.queueIndex = this.queueIndex+1 < this.queue.length ? this.queueIndex+1 : 0;
      this.nextImage = this.queue[this.queueIndex];
    }
    else {
      return;
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
