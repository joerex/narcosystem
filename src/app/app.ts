import {Component, bootstrap, CORE_DIRECTIVES} from 'angular2/angular2';
import {Http, JSONP_PROVIDERS} from 'angular2/http';
import {Insta} from './insta/insta';
import {Overslide} from './overslide/overslide';

@Component({
    selector: 'my-app',
    template: '<overslide></overslide>',
    directives: [CORE_DIRECTIVES, Overslide]
})

class AppComponent {
  constructor() {}
}

bootstrap(AppComponent, [JSONP_PROVIDERS, Insta, Overslide]);
