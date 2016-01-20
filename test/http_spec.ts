import {Http, HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/add/operator/map';
import {
  inject, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector} from 'angular2/core';
import {NgIf, NgFor} from 'angular2/common';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../src/react_native_renderer';
import {MockReactNativeWrapper} from "./mock_react_native_wrapper";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('ReactNativeRenderer', () => {

  beforeEach(() => {
    mock.reset();
  });
  beforeEachProviders(() => [
    provide(REACT_NATIVE_WRAPPER, {useValue: mock}),
    ReactNativeElementSchemaRegistry,
    provide(ElementSchemaRegistry, {useExisting: ReactNativeElementSchemaRegistry}),
    provide(ReactNativeRootRenderer, {useClass: ReactNativeRootRenderer_}),
    provide(RootRenderer, {useExisting: ReactNativeRootRenderer})
  ]);


  it('should support http', inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    tcb.overrideTemplate(TestComponent, `<Text>foo</Text>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      debugger;
    });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  viewProviders: [HTTP_PROVIDERS]
})
class TestComponent {
  people: any = null;
  constructor(http: Http) {
    http.get('https://raw.githubusercontent.com/angular/angular/master/bower.json')
      // Call map on the response observable to get the parsed data object
      .map(res => res.json())
      // Subscribe to the observable to get the parsed data object and attach it to the
      // component
      .subscribe(people => this.people = people);
  }
}
