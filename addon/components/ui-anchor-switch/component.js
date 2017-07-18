import Ember from 'ember';
import layout from './template';

import { task, waitForEvent } from 'ember-concurrency';
import { thenable } from 'ember-ui-kit/utils/raf';

export default Ember.Component.extend({
  classNames: 'ui-anchor-switch',
  layout,

  /**
   * @public
   * @attribute switch
   */
  switch: null,

  /**
   * @public
   * @attribute behavior
   */
  behavior: 'smooth',

  /**
   * @public
   * @attribute block
   */
  block: 'start',

  // a scroll spy feature
  sync: task(function *() {
    let cases = this.$('.ui-anchor-case');

    let { target } = yield waitForEvent(this.$(), 'scroll');

    yield this.get('poll').perform(target, cases);

    this.get('sync').perform();
  }).restartable(),

  poll: task(function *(target, cases) {
    let debounce = 60;
    let page = 0.2;

    let { offsetHeight, offsetTop } = this.element;

    let last = target.scrollTop;
    let count = 0;

    while (count < debounce) {
      let active = cases
        .filter(function() {
          return this.offsetTop - offsetTop - target.scrollTop >= 0;
        })
        .filter(function() {
          return (this.offsetTop - offsetTop - target.scrollTop) / offsetHeight < page;
        })
        .first();

      if (active.length) {
        this.sendAction('on-change', active.data('case'));
      }

      if (target.scrollTop === last) {
        count++;
      }
      else {
        count = 0;
      }

      last = target.scrollTop;

      yield thenable();
    }
  }).drop(),

  /**
   * @event on-change
   */
  didRender() {
    this._super(...arguments);

    this.get('sync').perform();
  }

}).reopenClass({
  positionalParams: ['switch']
});
