import {
  inject, injectAsync, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {fireEvent} from './../utils';
import {CustomTestComponentBuilder} from "../../src/testing/test_component_builder";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('Hammer', () => {

  beforeEach(() => {
    mock.reset();
  });
  beforeEachProviders(() => [
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
    provide(RootRenderer, {useExisting: ReactNativeRootRenderer}),
    CustomTestComponentBuilder,
    provide(TestComponentBuilder, {useExisting: CustomTestComponentBuilder})
  ]);

  it('should support tap', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (tapstart)="handleEvent($event)" (tapcancel)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0,0]]);
      fireEvent('topTouchEnd', target, 1000, [[0,5]]);
      fixture.detectChanges();
      expect(fixture.componentInstance.log.join(',')).toEqual('tapstart,tap');

      fixture.componentInstance.log = [];
      fireEvent('topTouchStart', target, 0, [[0,0]]);
      fireEvent('topTouchEnd', target, 1000, [[0,20]]);
      fixture.detectChanges();
      expect(fixture.componentInstance.log.join(',')).toEqual('tapstart,tapcancel');
    });
  }));

  it('should support doubletap', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (doubletap)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0);
      fireEvent('topTouchEnd', target, 10);
      fireEvent('topTouchStart', target, 20);
      fireEvent('topTouchEnd', target, 30);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('tap,tap,doubletap');
    });
  }));

  it('should support pan', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (pan)="handleEvent($event)" (panstart)="handleEvent($event)" (panmove)="handleEvent($event)"
     (panend)="handleEvent($event)" (pancancel)="handleEvent($event)" (panleft)="handleEvent($event)"
     (panright)="handleEvent($event)" (panup)="handleEvent($event)" (pandown)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('panstart,pan,panright,panmove,pan,panmove,pan,pan,panend');
    });
  }));

  it('should support swipe', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (swipe)="handleEvent($event)" (swipeleft)="handleEvent($event)"
    (swiperight)="handleEvent($event)" (swipeup)="handleEvent($event)" (swipedown)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('swiperight,swipe');
    });
  }));

  it('should support press', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (press)="handleEvent($event)" (pressup)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.debugElement.children[0];
      fireEvent('topTouchStart', target, 0);
      fixture.detectChanges();

      return new Promise((resolve) => {
        setTimeout(() => {
          fireEvent('topTouchEnd', target, 300);
          //fixture.detectChanges();
          expect(fixture.componentInstance.log.join(',')).toEqual('press,pressup');
          resolve();
        }, 300);
      });
    });
  }));

  it('should support pinch', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (pinch)="handleEvent($event)" (pinchstart)="handleEvent($event)"
    (pinchmove)="handleEvent($event)" (pinchend)="handleEvent($event)" (pinchcancel)="handleEvent($event)"
    (pinchin)="handleEvent($event)" (pinchout)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0,0], [0, 150]], [0, 1]);
      fireEvent('topTouchMove', target, 10, [[0,0], [0, 100]], [1]);
      fireEvent('topTouchMove', target, 20, [[0,0], [0, 50]], [1]);
      fireEvent('topTouchEnd', target, 30, [[0,0], [0, 0]], [1]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('pinchstart,pinch,pinchin,pinchmove,pinch,pinchin,pinch,pinchin,pinchend');
    });
  }));

  it('should support rotate', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (rotate)="handleEvent($event)" (rotatestart)="handleEvent($event)"
    (rotatemove)="handleEvent($event)" (rotateend)="handleEvent($event)" (rotatecancel)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0,0], [0, 150]], [0, 1]);
      fireEvent('topTouchMove', target, 10, [[0,0], [0, 100]], [1]);
      fireEvent('topTouchMove', target, 20, [[0,0], [0, 50]], [1]);
      fireEvent('topTouchEnd', target, 30, [[0,0], [0, 0]], [1]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('rotatestart,rotate,rotatemove,rotate,rotatemove,rotate,rotate,rotateend');
    });
  }));

  it('should support multiple gestures', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (swipe)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('swipe');
    });
  }));

  it('should support multiple gestures', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (tap)="handleEvent($event)" (swipe)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchMove', target, 20, [[50, 0]]);
      fireEvent('topTouchMove', target, 30, [[75, 0]]);
      fireEvent('topTouchEnd', target, 40, [[100, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('swipe');
    });
  }));

  it('should always emit tap events', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text (pan)="handleEvent($event)" (tapstart)="handleEvent($event)" (tapcancel)="handleEvent($event)">foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      fireEvent('topTouchStart', target, 0, [[0, 0]]);
      fireEvent('topTouchMove', target, 10, [[25, 0]]);
      fireEvent('topTouchEnd', target, 40, [[50, 0]]);
      fixture.detectChanges();

      expect(fixture.componentInstance.log.join(',')).toEqual('tapstart,pan,tapcancel,pan');
    });
  }));

  it('should add and remove event listeners', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<Text>foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0];
      var handler = () => {};
      expect(target._hammer).toEqual(null);
      target.addEventListener('tap', handler);
      expect(target._hammer.recognizers.length).toEqual(1);
      target.addEventListener('swipe', handler);
      expect(target._hammer.recognizers.length).toEqual(2);
      target.addEventListener('swiperight', handler);
      expect(target._hammer.recognizers.length).toEqual(2);

      target.removeEventListener('swiperight', handler);
      expect(target._hammer.recognizers.length).toEqual(2);
      target.removeEventListener('tap', handler);
      expect(target._hammer.recognizers.length).toEqual(1);
      target.removeEventListener('swipe', handler);
      expect(target._hammer).toEqual(null);
    });
  }));

  it('should propagates event', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<View (tap)="handleEvent($event)"><Text (tap)="handleEvent($event)">foo</Text></View>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0].children[0];
      fireEvent('topTouchStart', target, 0, [[0,0]]);
      fireEvent('topTouchEnd', target, 1000, [[0,5]]);
      fixture.detectChanges();
      expect(fixture.componentInstance.log.join(',')).toEqual('tap,tap');
    });
  }));

  it('should not propagate events after stopPropagation() call', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.overrideTemplate(TestComponent, `<View (tap)="handleEvent($event)"><Text (tap)="handleEventWithStop($event)">foo</Text></View>`)
      .createAsync(TestComponent).then((fixture) => {

      var target = fixture.elementRef.nativeElement.children[0].children[0];
      fireEvent('topTouchStart', target, 0, [[0,0]]);
      fireEvent('topTouchEnd', target, 1000, [[0,5]]);
      fixture.detectChanges();
      expect(fixture.componentInstance.log.join(',')).toEqual('tapWithStop');
    });
  }));

});



@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [NgIf, NgFor]
})
class TestComponent {
  log: Array<string> = [];

  handleEvent(evt: any) {
    this.log.push(evt.type);
  }

  handleEventWithStop(evt: any) {
    this.log.push(evt.type + 'WithStop');
    evt.stopPropagation();
  }
}