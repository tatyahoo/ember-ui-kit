import PageObject from '../page-object';
import { click, focus, blur } from 'ember-native-dom-helpers';

export default class ToggleInput extends PageObject {
  get prefix() {
    return this.find(`${this.selector} .in-toggle__prefix`);
  }

  get infix() {
    return this.find(`${this.selector} .in-toggle__infix`);
  }

  get postfix() {
    return this.find(`${this.selector} .in-toggle__postfix`);
  }

  get self() {
    let self = this.find(this.selector);

    if (!self.classList.contains('in-toggle')) {
      throw new Error('self is not a text input');
    }

    return self;
  }

  async focus() {
    let infix = this.infix;
    let self = this.self;

    await focus(infix);

    if (infix !== document.activeElement || !self.classList.contains('in-toggle--focus')) {
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

  async toggleOn() {
    let infix = this.infix;
    let self = this.self;

    if (infix.checked || self.classList.contains('in-toggle--on') || !self.classList.contains('in-toggle--off')) {
      throw new Error(`${this.selector} is already on`);
    }

    await click(this.infix);

    if (!infix.checked || !self.classList.contains('in-toggle--on') || self.classList.contains('in-toggle--off')) {
      throw new Error(`Unable to turn on ${this.selector}`);
    }
  }

  async toggleOff() {
    let infix = this.infix;
    let self = this.self;

    if (!infix.checked || !self.classList.contains('in-toggle--on') || self.classList.contains('in-toggle--off')) {
      throw new Error(`${this.selector} is already off`);
    }

    await click(this.infix);

    if (infix.checked || self.classList.contains('in-toggle--on') || !self.classList.contains('in-toggle--off')) {
      throw new Error(`Unable to turn off ${this.selector}`);
    }
  }
}
