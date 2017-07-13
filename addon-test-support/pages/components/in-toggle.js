import { click, focus, blur } from 'ember-native-dom-helpers';
import { findElementWithAssert } from 'ember-cli-page-object/extend';

import ComponentPageObject from '../component';

export default class ToggleInputComponentPageObject extends ComponentPageObject {
  get node() {
    if (this.isContextual) {
      return findElementWithAssert({ context: this.selector }, '.in-toggle').get(0);
    }

    return findElementWithAssert(this, '.in-toggle').get(0);
  }

  get input() {
    return this.node.querySelector('input');
  }

  get value() {
    return this.input.value;
  }

  focus() {
    return focus(this.input);
  }

  blur() {
    return blur(this.input);
  }

  click() {
    return click(this.input);
  }
}
