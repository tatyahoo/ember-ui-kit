import { click } from 'ember-native-dom-helpers';
import PageObject from '../page-object';

export default class BackdropComponent extends PageObject {
  get self() {
    return this.find(this.selector);
  }

  get content() {
    return this.options.content;
  }

  click() {
    return click(this.self);
  }
}
