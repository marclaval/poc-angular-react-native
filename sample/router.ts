import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {StyleSheet} from 'react-native';

@Component({
  selector: 'cpt-one',
  template: `<Text>One</Text>`
})
class CptOne {}

@Component({
  selector: 'cpt-two',
  template: `<Text>Two</Text>`
})
class CptTwo {}


@Component({
  selector: 'router-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  directives: [ROUTER_DIRECTIVES],
  template: `
<View [style]="styles.container" (tap)="navigate()">
  <Text>Hello router!</Text>
  <router-outlet></router-outlet>
  <Text>Bye router!</Text>
</View>
`
})
@RouteConfig([
  { path: '/', component: CptOne, as: 'One' },
  { path: '/two', component: CptTwo, as: 'Two' }
])
export class RouterApp {
  styles: any;
  constructor(private router: Router) {
    this.styles = StyleSheet.create({
      container: {
        position: 'absolute',
        left: 0,
        right:0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      }
    });
  }
  navigate() {
    this.router.navigateByUrl('/two');
  }
}

