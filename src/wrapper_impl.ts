// Zone.js
import {Zone} from 'zone.js/lib/core';
global.zone = new Zone();
import {patchSetClearFunction} from 'zone.js/lib/patch/functions';
patchSetClearFunction(global, ['timeout', 'interval', 'immediate']);

//ReactNative
import {ReactNativeWrapper} from "./wrapper";
var ReactNative = require('react-native');
var AppRegistry = ReactNative.AppRegistry;
var UIManager = ReactNative.NativeModules.UIManager;

var ReactUpdates =  require('ReactUpdates');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');

const RCT_VIEW_NAMES: { [s: string]: string } = {
  "ImageView": "RCTImageView",
  "ScrollView": "RCTScrollView",
  "RawText": "RCTRawText",
  "Text": "RCTText",
  "TextInput": "AndroidTextInput",
  "View": "RCTView",
}

export class ReactNativeWrapperImpl extends ReactNativeWrapper {
  static registerApp(name: string, callback: Function) {
    AppRegistry.registerRunnable(name, callback);
  }

  computeStyle(styles: Object): Object {
    return ReactNativeAttributePayload.create({style: styles}, ReactNativeViewAttributes.RCTView);
  }

  createView(tagName: string, root: number, properties: Object): number {
    var tag = ReactNativeTagHandles.allocateTag();
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['View'];
    this.$log(`Creating a ${viewName} with tag ${tag} and attribs:`, properties);
    UIManager.createView(tag, viewName, 1, properties);
    return tag;
  }

  updateView(tag: number, tagName: string, properties: Object) {
    var viewName = RCT_VIEW_NAMES[tagName] || RCT_VIEW_NAMES['View'];
    this.$log(`Updating property ${viewName} in ${tag} to`, properties);
    UIManager.updateView(tag, viewName, properties);
  }

  manageChildren(parentTag: number, moveFrom: Array<number>, moveTo: Array<number>, addTags: Array<number>, addAt: Array<number>, removeAt: Array<number>) {
    UIManager.manageChildren(parentTag, moveFrom, moveTo, addTags, addAt, removeAt);
  }

  dispatchCommand(tag: number, command: string) {
    //TODO: generalize
    var commands: {[s: string]: number} = {
      'blur': UIManager.AndroidTextInput.Commands.blurTextInput,
      'focus':UIManager.AndroidTextInput.Commands.focusTextInput
    };
    //iOS: NativeModules.UIManager.blur(this.nativeTag);
    UIManager.dispatchViewManagerCommand(tag, commands[command], null);
  }

  patchReactUpdates(zone: any): void {
    ReactUpdates.batchedUpdates = zone.bind(ReactUpdates.batchedUpdates);
  }

  patchReactNativeEventEmitter(nodeMap: Map<number, any>): void {
    ReactNativeEventEmitter.receiveEvent = (nativeTag: number, topLevelType: string, nativeEventParam: any) => {
      this.$log('receiveEvent', nativeTag, topLevelType, nativeEventParam);
      var element = nodeMap.get(nativeTag);
      if (nativeEventParam.target) {
        nativeEventParam.target = nodeMap.get(nativeEventParam.target);
        nativeEventParam.type = topLevelType;
        nativeEventParam.clientX = nativeEventParam.pageX;
        nativeEventParam.clientY = nativeEventParam.pageY;
        nativeEventParam.preventDefault = () => {};
      }
      if (element) {
        element.fireEvent(topLevelType, nativeEventParam);
      }
    }

    ReactNativeEventEmitter.receiveTouches = (eventTopLevelType: string, touches: Array<any>, changedIndices: Array<number>) => {
      this.$log('receiveTouches', eventTopLevelType, touches, changedIndices);
      for (var i = 0; i < touches.length; i++) {
        var element = nodeMap.get(touches[i].target);
        if (touches[i].target) {
          touches[i].target = nodeMap.get(touches[i].target);
          touches[i].type = eventTopLevelType;
          touches[i].clientX = touches[i].pageX;
          touches[i].clientY = touches[i].pageY;
          touches[i].preventDefault = () => {};
        }
        while (element) {
          element.fireEvent(eventTopLevelType, touches[i]);
          element = element.parent;
        }
      }
    };
  }
  
  $log(...args: any[]) {
    //console.log(...args);
  }
}

/*
 At run time:

 NativeModules.UIManager.RCTText.NativeProps =
 {"opacity":"number","renderToHardwareTextureAndroid":"boolean","numberOfLines":"number","borderBottomWidth":"number","scaleY":"number","position":"String","paddingTop":"number","borderWidth":"number","color":"number","marginLeft":"number","fontFamily":"String","marginHorizontal":"number","fontStyle":"String","paddingBottom":"number","paddingHorizontal":"number","scaleX":"number","onLayout":"boolean","flexWrap":"String","borderTopWidth":"number","borderRightWidth":"number","marginTop":"number","translateX":"number","rotation":"number","accessibilityLiveRegion":"String","alignItems":"String","accessibilityComponentType":"String","paddingVertical":"number","flex":"number","marginBottom":"number","bottom":"number","textAlign":"String","justifyContent":"String","fontWeight":"String","padding":"number","alignSelf":"String","backgroundColor":"number","right":"number","borderLeftWidth":"number","height":"number","left":"number","translateY":"number","paddingRight":"number","lineHeight":"number","flexDirection":"String","importantForAccessibility":"String","marginVertical":"number","fontSize":"number","accessibilityLabel":"String","width":"number","paddingLeft":"number","text":"String","top":"number","margin":"number","decomposedMatrix":"Map","marginRight":"number","testID":"String"}

 Style:
 ReactNativeViewAttributes.RCTView

 Android:
 AccessibilityEventTypes: Object
 AndroidDrawerLayout: Object
 AndroidHorizontalScrollView: Object
 AndroidProgressBar: Object
 AndroidSwitch: Object
 AndroidTextInput: Object
 AndroidViewPager: Object
 Dimensions: Object
 PopupMenu: Object
 RCTImageView: Object
 RCTRawText: Object
 RCTScrollView: Object
 RCTText: Object
 RCTView: Object
 RCTVirtualText: Object
 StyleConstants: Object
 ToolbarAndroid: Object
 UIText: Object
 UIView: Object
 */