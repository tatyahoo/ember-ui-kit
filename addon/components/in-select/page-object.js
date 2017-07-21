import { fillIn, focus, blur } from 'ember-native-dom-helpers';
import PageObject from '../page-object';

export default class SelectInputComponent extends PageObject {
  async focus() {
    let infix = this.infix;
    let self = this.self;

    await focus(infix);

    if (infix !== document.activeElement || !self.classList.contains('in-text--focus')) {
      throw new Error(`Failed to focus ${this.selector}`);
    }
  }

  async blur() {
    let infix = this.infix;

    await blur(infix);

    if (infix === document.activeElement) {
      throw new Error(`Failed to blur ${this.selector}`);
    }
  }

  get disabled() {
    let infix = this.infix;
    let self = this.self;

    if (infix.disabled) {
      if (!self.classList.contains('in-toggle--disabled')) {
        throw new Error('Disabled class name not attached');
      }
    }
    else {
      if (self.classList.contains('in-toggle--enabled')) {
        throw new Error('Enabled class name wrongly attached');
      }
    }

    return infix.disabled;
  }

  get enabled() {
    let infix = this.infix;
    let self = this.self;

    if (!infix.disabled) {
      if (!self.classList.contains('in-toggle--enabled')) {
        throw new Error('Enabled class name not attached');
      }
    }
    else {
      if (!self.classList.contains('in-toggle--disabled')) {
        throw new Error('Disabled class name wrongly attached');
      }
    }

    return !infix.disabled;
  }
}
