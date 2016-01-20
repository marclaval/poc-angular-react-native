import {Component} from 'angular2/core';
import {Http} from 'angular2/http';
import {HTTP_PROVIDERS} from './xhr_backend';
import 'rxjs/add/operator/map';

import {NativeFeedback} from './common';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'http-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  viewProviders: [HTTP_PROVIDERS],
  directives: [NativeFeedback],
  template: `
<View [style]="styles.button" nativeFeedback (tap)="sendXHR()">
  <Text [style]="styles.buttonText">Clear logs</Text>
</View>
`
})
export class HttpApp {
  styles: any;
  data: any = null;
  constructor(private http: Http) {
    this.styles = StyleSheet.create({
      button: {
        padding: 10,
        backgroundColor: '#005eb8',
        height: 50,
        margin: 10
      },
      buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 20
      }
    });
  }

  sendXHR() {
    this.http.get('https://raw.githubusercontent.com/angular/angular/master/bower.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
      });
  }
}