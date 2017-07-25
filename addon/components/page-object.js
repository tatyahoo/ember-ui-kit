import { findWithAssert } from 'ember-native-dom-helpers';

export default function PageObject(selector, options = {}) {
  this.selector = selector;
  this.options = options;
  this.context = null;
}

PageObject.prototype.find = function(selector) {
  return findWithAssert(selector, this.context);
};

// Adapt to ember-cli-page-object's interface
PageObject.prototype.isDescriptor = true;
PageObject.prototype.setup = function() {
  let self = this;

  /* global require */
  let { buildSelector } = require('ember-cli-page-object/extend');

  Object.defineProperty(self, 'value', { value: false, configurable: true });

  self.get = function() {
    delete self.value;

    self.context = document.querySelector(buildSelector(this, null, {}));

    return self;
  };
};
