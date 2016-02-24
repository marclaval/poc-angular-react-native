//ReactNative
import {ReactNativeWrapper, overridePlatform} from "./wrapper";
var ReactNative = require('react-native');
var AppRegistry = ReactNative.AppRegistry;
var UIManager = ReactNative.NativeModules.UIManager;
var resolveAssetSource = require('resolveAssetSource');

var ReactUpdates =  require('ReactUpdates');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');

overridePlatform(ReactNative.Platform.OS);

const RCT_VIEW_NAMES: { [s: string]: string } = {
  'native-view': 'RCTView',
  'native-text': 'RCTText',
  'native-rawtext': 'RCTRawText',
  'native-virtualtext': 'RCTVirtualText',
  'native-switch': 'AndroidSwitch',
  'native-textinput' : 'AndroidTextInput',
  'native-webview': 'RCTWebView',
  "native-progressbar": "AndroidProgressBar",
  "native-pagerlayout": "AndroidViewPager",

  "DropdownPicker": "AndroidDropdownPicker",
  "DialogPicker": "AndroidDialogPicker",
  "DrawerLayout": "AndroidDrawerLayout",
  "Image": "RCTImageView",
  "ScrollView": "RCTScrollView",
  "HorizontalScrollView" : "AndroidHorizontalScrollView",
  "SwipeRefreshLayout": "AndroidSwipeRefreshLayout",
  "InlineImage": "RCTTextInlineImage",
  "TextInput": "AndroidTextInput",
  "Toolbar": "ToolbarAndroid",
}

export class ReactNativeWrapperImpl extends ReactNativeWrapper {
  static registerApp(name: string, callback: Function) {
    AppRegistry.registerRunnable(name, callback);
  }

  computeStyle(styles: Object): Object {
    return ReactNativeAttributePayload.create({style: styles}, ReactNativeViewAttributes.RCTView);
  }

  processColor(color: string): number {
    return ReactNative.processColor(color);
  }

  resolveAssetSource(source: any): any {
    return resolveAssetSource(source);
  };

  createView(tagName: string, root: number, properties: Object): number {
    var tag = ReactNativeTagHandles.allocateTag();
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['native-view'];
    this.$log(`Creating a ${viewName} with tag ${tag} and attribs:`, properties);
    UIManager.createView(tag, viewName, 1, properties);
    return tag;
  }

  updateView(tag: number, tagName: string, properties: Object) {
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['native-view'];
    this.$log(`Updating property ${viewName} in ${tag} to`, properties);
    UIManager.updateView(tag, viewName, properties);
  }

  manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeAt: Array<number>) {
    this.$log(`Managing children of ${parentTag}:`, moveFrom, moveTo, addTags, addAt, removeAt);
    UIManager.manageChildren(parentTag, moveFrom, moveTo, addTags, addAt, removeAt);
  }

  dispatchCommand(tag: number, command: string, params: any = null) {
    var commands: {[s: string]: number} = {
      'blurTextInput': UIManager.AndroidTextInput.Commands.blurTextInput,
      'focusTextInput': UIManager.AndroidTextInput.Commands.focusTextInput,
      'openDrawer': UIManager.AndroidDrawerLayout.Commands.openDrawer,
      'closeDrawer': UIManager.AndroidDrawerLayout.Commands.closeDrawer,
      'hotspotUpdate': UIManager.RCTView.Commands.hotspotUpdate,
      'setPressed': UIManager.RCTView.Commands.setPressed,
      'setPage': UIManager.AndroidViewPager.Commands.setPage,
      'setPageWithoutAnimation': UIManager.AndroidViewPager.Commands.setPageWithoutAnimation,
      'goForward': UIManager.RCTWebView.Commands.goForward,
      'reload': UIManager.RCTWebView.Commands.reload,
      'goBack': UIManager.RCTWebView.Commands.goBack
    };
    this.$log(`Dispatching command to ${tag}: ${command} with ${params}`);
    UIManager.dispatchViewManagerCommand(tag, commands[command], params);
  }

  patchReactUpdates(zone: any): void {
    ReactUpdates.batchedUpdates = zone.bind(ReactUpdates.batchedUpdates);
  }

  patchReactNativeEventEmitter(nodeMap: Map<number, any>): void {
    ReactNativeEventEmitter.receiveEvent = (nativeTag: number, topLevelType: string, nativeEventParam: any) => {
      this.$log('receiveEvent', nativeTag, topLevelType, nativeEventParam);
      var element = nodeMap.get(nativeTag);
      if (nativeEventParam && nativeEventParam.target) {
        nativeEventParam.target = nodeMap.get(nativeEventParam.target);
        nativeEventParam.clientX = nativeEventParam.pageX;
        nativeEventParam.clientY = nativeEventParam.pageY;
      }
      else {
        if (!nativeEventParam) nativeEventParam = {};
        nativeEventParam.target = element;
      }
      nativeEventParam.type = topLevelType;
      nativeEventParam.preventDefault = () => {};
      nativeEventParam._stop = true;
      nativeEventParam.stopPropagation = () => {
        nativeEventParam._stop = true;
      };
      if (element) {
        element.fireEvent(topLevelType, nativeEventParam);
      }
    }

    ReactNativeEventEmitter.receiveTouches = (eventTopLevelType: string, touches: Array<any>, changedIndices: Array<number>) => {
      this.$log('receiveTouches', eventTopLevelType, touches, changedIndices);
      var event = touches[0];
      if (event.target) {
        event.target = nodeMap.get(event.target);
        event.type = eventTopLevelType;
        event.clientX = event.pageX;
        event.clientY = event.pageY;
        event.preventDefault = () => {};
        event._stop = false;
        event.stopPropagation = () => {
          event._stop = true;
        };
      }

      for (var i = 0; i < touches.length; i++) {
        if (touches[i].target) {
          touches[i].clientX = touches[i].pageX;
          touches[i].clientY = touches[i].pageY;
        }
      }
      event.touches = touches;
      event.changedIndices = changedIndices;
      if (event.target) {
        event.target.fireEvent(eventTopLevelType, event);
      } else {
        //TODO: manage global event on "window" ?
      }

    };
  }

  isAndroid(): boolean {
    return ReactNative.Platform.OS == 'android';
  }
  
  $log(...args: any[]) {
    //console.log(...args);
  }
}
