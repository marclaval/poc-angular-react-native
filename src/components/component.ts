import {ReactNativeWrapper} from './../wrapper/wrapper';

export const GENERIC_INPUTS: Array<string> = [
  //Both
  'accessible', 'accessibilityLabel', 'testID', 'pointerEvents', 'removeClippedSubviews', 'onLayout',
  //Android
  'collapsable', 'accessibilityLiveRegion', 'accessibilityComponentType', 'importantForAccessibility',
  'needsOffscreenAlphaCompositing', 'renderToHardwareTextureAndroid ', 'nativeBackgroundAndroid',
  //iOS
  'accessibilityTraits', 'shouldRasterizeIOS',
  //Style
  'styleSheet', 'style'];

export const GENERIC_BINDINGS: string = `[accessible]="_accessible" [accessibilityLabel]="_accessibilityLabel" [testID]="_testID" [pointerEvents]="_pointerEvents" [removeClippedSubviews]="_removeClippedSubviews"
  [onLayout]="_onLayout" [collapsable]="_collapsable" [accessibilityLiveRegion]="_accessibilityLiveRegion" [accessibilityComponentType]="_accessibilityComponentType"
  [importantForAccessibility]="_importantForAccessibility" [needsOffscreenAlphaCompositing]="_needsOffscreenAlphaCompositing" [renderToHardwareTextureAndroid]="_renderToHardwareTextureAndroid"
  [nativeBackgroundAndroid]="_nativeBackgroundAndroid" [accessibilityTraits]="_accessibilityTraits" [shouldRasterizeIOS]="_shouldRasterizeIOS"
  [styleSheet]="_styleSheet" [style]="_style"`;

export abstract class HighLevelComponent {

  private _wrapper: ReactNativeWrapper;

  constructor(_wrapper: ReactNativeWrapper) {
    this._wrapper = _wrapper;
  }

  //Both platforms
  private _accessible: boolean;
  private _accessibilityLabel: string;
  private _testID: string;
  private _pointerEvents: string;
  private _removeClippedSubviews: boolean;
  private _onLayout: boolean;
  set accessible(value: any) { this._accessible = this.processBoolean(value);}
  set accessibilityLabel(value: string) {this._accessibilityLabel = value;}
  set testID(value: string) {this._testID = value;}
  set pointerEvents(value: string) {this._pointerEvents = this.processEnum(value, ['auto', 'box-none', 'none', 'box-only']);}
  set removeClippedSubviews(value: any) { this._removeClippedSubviews = this.processBoolean(value);}
  set onLayout(value: any) { this._onLayout = this.processBoolean(value);}

  //Android specific
  private _collapsable: boolean;
  private _accessibilityLiveRegion: string;
  private _accessibilityComponentType: string;
  private _importantForAccessibility: string;
  private _needsOffscreenAlphaCompositing: boolean;
  private _renderToHardwareTextureAndroid: boolean;
  private _nativeBackgroundAndroid: any;
  set collapsable(value: any) { this._collapsable = this.processBoolean(value);}
  set accessibilityLiveRegion(value: string) {this._accessibilityLiveRegion = value;}
  set accessibilityComponentType(value: string) {this._accessibilityComponentType = value;}
  set importantForAccessibility(value: string) {this._importantForAccessibility = value;}
  set needsOffscreenAlphaCompositing(value: any) { this._needsOffscreenAlphaCompositing = this.processBoolean(value);}
  set renderToHardwareTextureAndroid(value: any) { this._renderToHardwareTextureAndroid = this.processBoolean(value);}
  set nativeBackgroundAndroid(value: any) {this._nativeBackgroundAndroid = value;}

  //iOS specific
  private _accessibilityTraits: any;
  private _shouldRasterizeIOS: boolean;
  set accessibilityTraits(value: any) {this._accessibilityTraits = value;}
  set shouldRasterizeIOS(value: any) { this._shouldRasterizeIOS = this.processBoolean(value);}

  //Style
  private _defaultStyle: {[s: string]: any } = {};
  private _styleSheet: Array<number | boolean | {[s: string]: any }>;
  private _style: {[s: string]: any };
  set styleSheet(value: Array<number | boolean> | number | boolean) {this._styleSheet = [this._defaultStyle].concat(Array.isArray(value) ? value : [value]);}
  set style(value: {[s: string]: any }) {this._style = value;}

  setDefaultStyle(defaultStyle: {[s: string]: any }): void {
    this._defaultStyle = defaultStyle;
    this._styleSheet = [defaultStyle];
  }

  processBoolean(value: any): boolean {
    return value == true || value == 'true';
  }

  processNumber(value: any): number {
    return (!isNaN(parseInt(value))) ? parseInt(value) : value;
  }

  processColor(color: string): number {
    return this._wrapper.processColor(color);
  }

  processEnum(value: string, list: Array<String>) {
    return list.indexOf(value) > -1 ? value : list[0];
  }
}