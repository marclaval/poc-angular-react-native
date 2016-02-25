import {Component} from 'angular2/core';
import {StyleSheet} from 'react-native';
var resolveAssetSource = require('resolveAssetSource');

@Component({
  selector: 'hello-app',
  host: {position: 'absolute', top: '0', left: '0', bottom: '0', right: '0'},
  template: `
<RefreshControl progressBackgroundColor="#ce0058" [colors]="['#00a9e0', '#309712']" [style]="{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}">
  <View [styleSheet]="styles.container">
    <Text [styleSheet]="styles.welcome">
      Welcome to ngReactNative!
    </Text>
    <Text [styleSheet]="styles.instructions">
      To get started, use the drawer menu on the left
    </Text>
    <Text [styleSheet]="styles.instructions">
      Shake or press menu button for dev menu
    </Text>
  </View>
  <Image height="100" width="100" overflow="hidden" shouldNotifyLoadEvents="false" [src]="angularLogo.uri" position ="absolute" bottom="0" left="0"></Image>
  <Image height="100" width="100" overflow="hidden" shouldNotifyLoadEvents="false" [src]="reactLogo.uri" position ="absolute" bottom="0" right="0"></Image>
</RefreshControl>
`
})
export class HelloApp {
  angularLogo: any = resolveAssetSource(require('../../assets/angular.png'));
  reactLogo: any = resolveAssetSource(require('../../assets/react.png'));
  styles: any;
  constructor() {
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
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
      }
    });
  }
}

