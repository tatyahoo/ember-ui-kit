export default class ComponentPageObject {
  constructor(selector, options = {}) {
    let po = this;

    this.isDescriptor = true;
    this.selector = selector;
    this.options = options;

    if (this.isScoped) {
      // acceptance test
      return {
        isDescriptor: true,

        get() {
          return po;
        }
      };
    }
    else {
      this.scope = this.selector;
    }
  }

  get node() {
    throw 'Not Implemented';
  }

  get isContextual() {
    return typeof this.selector !== 'string';
  }

  get isScoped() {
    return !this.isContextual;
  }

  is(query) {
    return Ember.$(this.node).is(query);
  }
}
