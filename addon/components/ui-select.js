import Ember from 'ember';
import layout from '../templates/components/ui-select';

export default Ember.Component.extend({
  attributeBindings: 'tabIndex',

  classNames: 'ui-select',

  layout,

  // attrs {
  focus: 'auto', // auto | programmatic | none
  selectable: null,
  // attrs }

  tabIndex: Ember.computed('focus', function() {
    switch (this.get('focus')) {
      case 'auto': return 0;
      case 'programmatic': return -1;
      case 'none': return null;
    }

    Ember.assert('Invalid value for `focus`');
  }).readOnly(),

  isActive: false,

  focusOut() {
    this.set('isActive', false);
  },

  click(evt) {
    this.toggleProperty('isActive');

    // mouseDown also prevents focusIn event
    // so we need to programmatically trigger the focus again
    evt.target.focus();
  },

  // focusOut event triggers before click
  // if focusOut handler destroys the click receiver,
  // the event will never fires.
  // this solves that issue
  mouseDown(evt) {
    evt.preventDefault();
  },

  actions: {
    select(...items) {
      this.get('selectable').select(...items);
    },

    unselect(...items) {
      this.get('selectable').unselect(...items);
    },

    clear() {
      this.get('selectable').clear();
    }
  }
}).reopenClass({
  positionalParams: ['selectable']
});
