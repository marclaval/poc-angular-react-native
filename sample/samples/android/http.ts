import {Component} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

import {NativeFeedback} from './common';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'http-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [NativeFeedback, NgFor],
  template: `
<TextInput [autoFocus]="true" placeholder="Search Wikipedia" (submit)="sendXHR($event)"></TextInput>
<native-text *ngFor="#page of pages">{{page}}</native-text>
`
})
export class HttpApp {
  pages: Array<any> = [];
  constructor(private http: Http) {}

  sendXHR(text: string) {
    if (text && text.length > 0) {
      this.http.get('https://en.wikipedia.org/w/api.php?format=json&action=query&generator=allpages&gaplimit=10&gapfrom=' + text)
        .map(res => res.json())
        .subscribe(data => {
          this.pages = [];
          var raw = data['query'].pages;
          for (var key in raw) {
            this.pages.push(raw[key].title);
          }
        });
    }

  }
}