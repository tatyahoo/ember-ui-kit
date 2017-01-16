import Ember from 'ember';

/* global elementResizeDetectorMaker */
let detector = elementResizeDetectorMaker({
  strategy: 'scroll'
});

export default Ember.Mixin.create({
  didInsertElement() {
    this._super(...arguments);

    detector.listenTo(this.element, Ember.run.bind(this, this.resize));
  },

  resize: Ember.$.noop,

  willDestroyElement() {
    this._super(...arguments);

    detector.uninstall(this.element);
  }
});
