import { fillIn, focus, blur } from 'ember-native-dom-helpers';
import { findElementWithAssert } from 'ember-cli-page-object/extend';

import ComponentPageObject from '../component';

export default class TextInputComponentPageObject extends ComponentPageObject {
  get node() {
    if (this.isContextual) {
      return findElementWithAssert({ context: this.selector }, '.in-text').get(0);
    }

    return findElementWithAssert(this, '.in-text').get(0);
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

  fillIn(text) {
    return fillIn(this.input, text);
  }
}
