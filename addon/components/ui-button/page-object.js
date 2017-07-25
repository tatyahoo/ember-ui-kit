import { click, focus, blur } from 'ember-native-dom-helpers';
import PageObject from '../page-object';

export default class ButtonComponent extends PageObject {
  get prefix() {
    return this.find(`${this.selector} .ui-button__prefix`);
  }

  get infix() {
    return this.find(`${this.selector} .ui-button__infix`);
  }

  get postfix() {
    return this.find(`${this.selector} .ui-button__postfix`);
  }

  get self() {
    let self = this.find(this.selector);

    if (!self.classList.contains('ui-button')) {
      throw new Error('self is not a text input');
    }

    return self;
  }

  async focus() {
    let self = this.self;

    await focus(self);

    if (self !== document.activeElement || !self.classList.contains('ui-button--focus')) {
      throw new Error(`Failed to focus ${this.selector}`);
    }
  }

  async blur() {
    let self = this.self;

    await blur(self);

    if (self === document.activeElement) {
      throw new Error(`Failed to blur ${this.selector}`);
    }
  }

  click() {
    if (typeof document.elementsFromPoint === 'function') {
      let self = this.self;
      let rect = self.getBoundingClientRect();

      let stack = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);

      let count = stack
        .slice(0, stack.indexOf(this.self))
        .filter(node => !self.contains(node))
        .map(node => getComputedStyle(node).getPropertyValue('pointer-events'))
        .filter(pe => pe !== 'none');

      if (count.length) {
        throw new Error(`${this.selector} is masked by another element`);
      }
    }

    return click(this.self);
  }

  get disabled() {
    let self = this.self;

    if (self.disabled) {
      if (!self.classList.contains('ui-button--disabled')) {
        throw new Error('Disabled class name not attached');
      }
    }
    else {
      if (self.classList.contains('ui-button--enabled')) {
        throw new Error('Enabled class name wrongly attached');
      }
    }

    return self.disabled;
  }

  get enabled() {
    let self = this.self;

    if (!self.disabled) {
      if (!self.classList.contains('ui-button--enabled')) {
        throw new Error('Enabled class name not attached');
      }
    }
    else {
      if (!self.classList.contains('ui-button--disabled')) {
        throw new Error('Disabled class name wrongly attached');
      }
    }

    return !self.disabled;
  }

  get text() {
    return this.self.textContent.trim();
  }

  get value() {
    return this.self.value;
  }
}
