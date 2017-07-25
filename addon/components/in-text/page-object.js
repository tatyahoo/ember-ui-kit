import { fillIn, focus, blur } from 'ember-native-dom-helpers';
import PageObject from '../page-object';

export default class TextInput extends PageObject {
  get prefix() {
    return this.find(`${this.selector} .in-text__prefix`);
  }

  get infix() {
    return this.find(`${this.selector} .in-text__infix`);
  }

  get postfix() {
    return this.find(`${this.selector} .in-text__postfix`);
  }

  get self() {
    let self = this.find(this.selector);

    if (!self.classList.contains('in-text')) {
      throw new Error('self is not a text input');
    }

    return self;
  }

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

  async fillIn(text) {
    let infix = this.infix;

    await fillIn(this.infix, text);

    if (infix.value !== text) {
      throw new Error(`Failed to fillIn ${this.selector}`);
    }
  }

  get disabled() {
    let infix = this.infix;
    let self = this.self;

    if (infix.disabled) {
      if (!self.classList.contains('in-text--disabled')) {
        throw new Error('Disabled class name not attached');
      }
    }
    else {
      if (self.classList.contains('in-text--enabled')) {
        throw new Error('Enabled class name wrongly attached');
      }
    }

    return infix.disabled;
  }

  get enabled() {
    let infix = this.infix;
    let self = this.self;

    if (!infix.disabled) {
      if (!self.classList.contains('in-text--enabled')) {
        throw new Error('Enabled class name not attached');
      }
    }
    else {
      if (!self.classList.contains('in-text--disabled')) {
        throw new Error('Disabled class name wrongly attached');
      }
    }

    return !infix.disabled;
  }

  get value() {
    return this.infix.value;
  }
}
