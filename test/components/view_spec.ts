import {
  injectAsync, TestComponentBuilder,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, RootRenderer, provide, Injector} from 'angular2/core';
import {ElementSchemaRegistry} from 'angular2/src/compiler/schema/element_schema_registry';
import {ReactNativeRootRenderer, ReactNativeRootRenderer_, ReactNativeElementSchemaRegistry, REACT_NATIVE_WRAPPER} from '../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../src/wrapper/wrapper_mock";
import {View} from "./../../src/components/view"
import {CustomTestComponentBuilder} from "../../src/testing/test_component_builder";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('View', () => {

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


  iit('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<View></View>`)
      .createAsync(TestComponent).then((fixture) => {
      fixture.detectChanges();
      rootRenderer.executeCommands();
      expect(mock.commandLogs.toString()).toEqual(
        'CREATE+2+test-cmp+{},ATTACH+1+2+0,CREATE+3+View+{},ATTACH+2+3+0');
    });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [View]
})
class TestComponent {}