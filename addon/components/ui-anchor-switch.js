import Ember from 'ember';
import layout from '../templates/components/ui-anchor-switch';

import { task, timeout, waitForEvent } from 'ember-concurrency';
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
    let { offsetHeight, offsetTop } = this.element;

    while (true) {
      let evt = yield waitForEvent(this.$(), 'scroll');

      let active = cases
        .filter(function() {
          return this.offsetTop - offsetTop - evt.target.scrollTop >= 0;
        })
        .filter(function() {
          return (this.offsetTop - offsetTop - evt.target.scrollTop) / offsetHeight < 0.2;
        })
        .first();

      if (active.length) {
        this.sendAction('on-change', active.data('case'));
      }
    }

    //yield thenable();
  }).restartable(),

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
