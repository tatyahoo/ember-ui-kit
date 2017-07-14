import Ember from 'ember';
import layout from '../templates/components/x-resize';

import { sendEventAction } from 'ember-ui-kit/utils/ddau';

/* global elementResizeDetectorMaker */
const DETECTOR = elementResizeDetectorMaker({
  strategy: 'scroll'
});

export default Ember.Component.extend({
  classNames: 'x-resize',
  layout,

  xDetector: Ember.computed(function() {
    return this.element.lastChild.previousSibling;
  }).readOnly(),

  yDetector: Ember.computed(function() {
    return this.element.firstChild.lastChild.previousSibling;
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);

    let xDetector = this.get('xDetector');
    let yDetector = this.get('yDetector');

    DETECTOR.listenTo(xDetector, this.xMeasure = Ember.run.bind(this, this.xMeasure));
    DETECTOR.listenTo(yDetector, this.yMeasure = Ember.run.bind(this, this.yMeasure));
  },

  /**
   * @event on-resize-x
   */
  xMeasure(detector) {
    sendEventAction(this, 'on-resize-x', 'width', detector.getBoundingClientRect().width);
  },

  /**
   * @event on-resize-y
   */
  yMeasure(detector) {
    sendEventAction(this, 'on-resize-y', 'height', detector.getBoundingClientRect().height);
  },

  willDestroyElement() {
    this._super(...arguments);

    let xDetector = this.get('xDetector');
    let yDetector = this.get('yDetector');

    DETECTOR.removeListener(xDetector, this.xMeasure);
    DETECTOR.removeListener(yDetector, this.yMeasure);
  }
});
