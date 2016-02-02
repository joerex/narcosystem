import {Component, Injectable} from 'angular2/angular2';
import {Jsonp} from 'angular2/http';

@Injectable()

export class Insta {
  data : Object[];
  tag : string;
  min : string;
  max : string;
  count : number;
  token : string;
  interval : number;
  clientID : string = 'ca1289b16c0d4310a6738c84ed62ed06';
  redirectURI : string = 'http://' + window.location.host;
  authURL : string = 'https://instagram.com/oauth/authorize/?client_id='
                              + this.clientID + '&redirect_uri=' + this.redirectURI
                              + '&response_type=token';
  endpoint = function(): string {
    let url =  'https://api.instagram.com/v1/tags/'
              + this.tag + '/media/recent?callback=JSONP_CALLBACK&client_id=' + this.clientID;
    if (this.max != undefined) {
      url += '&max_tag_id=' + this.max;
    }
    if (this.min != undefined) {
      url += '&min_tag_id=' + this.min;
    }
    return url;
  }

  constructor(
    public jsonp : Jsonp
  ) {
    this.tag = 'selfie';
    this.data = [];
    this.count = 0;
    this.main();
  }

  main() {
    let hash = window.location.hash.substr(1).split('=');
    if ( hash[0] === 'access_token' && hash[1] != undefined ) {
      this.token = hash[1];
      this.fetch();
      this.setInterval();
    } else {
      window.location.href = this.authURL;
    }
  }

  setInterval() {
    let __this = this;
    this.interval = setInterval(function() {
      __this.fetch();
    }, 5000);
  }

  reset() {
    this.data = [];
    this.count = 0;
    this.min = null;
    this.fetch();
    clearInterval(this.interval);
    this.setInterval();
  }

  newTag(tag) {
    this.tag = tag;
    this.reset();
  }

  fetch() {
    //console.log('Fetching from instagram...');
    this.jsonp.request(this.endpoint())
    .map(res => res.json())
    .map(res => {
      return {
        min: res.pagination.min_tag_id,
        data: res.data.map( item => {
          // add a high resolution link (api currently does not provide this)
          var highURL = item.images.low_resolution.url.replace('320x320', '1080x1080');
          item.images.high_resolution = {};
          item.images.high_resolution.url = highURL;
          return item
        })
      }
    })
    .subscribe(
      res => {
        //console.log('RES', res.data);
        this.data = this.data.concat(res.data);
        this.count = this.data.length;
        if (res.min != undefined) this.min = res.min;
        //this.max = res.pagination.next_max_tag_id;
        //console.log(this.data);
        console.log('Returned ' + res.data.length + ' new items.');
      },
      err => console.log('Error: ', err),
      () => console.log('')
    );
  }
}
