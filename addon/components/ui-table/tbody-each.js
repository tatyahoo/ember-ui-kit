import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody-each';

import Body from './tbody';

import { throttle } from '../../utils/raf';
import { construct } from '../../utils/computed';
import { observerOnce } from '../../utils/run';

const OVERSCAN_ROWS = 10;

export default Body.extend({
  classNames: 'ui-table--tbody-each',
  layout,

  // attrs {
  model: null,
  // attrs }

  modelNormalized: Ember.computed('model', function() {
    let content = this.get('model');

    if (!Ember.isArray(content) && typeof content.forEach === 'function') {
      let accum = [];

      content.forEach(item => {
        accum.push(item);
      });

      content = accum;
    }

    return Ember.ArrayProxy.create({ content });
  }).readOnly(),

  modelWatcher: observerOnce('modelNormalized.[]', function() {
    this.resizeHeight();
  }),

  buffer: construct(Ember.A).readOnly(),
  bufferCursors: Ember.computed(function() {
    return { start: 0, end: 0 };
  }).readOnly(),

  resizeHeight() {
    this._super(...arguments);

    let scroller = this.get('scroller.unfroze');
    let scrollable = this.get('scrollable.unfroze');

    let cursor = this.get('bufferCursors');
    let buffer = this.get('buffer');
    let model = this.get('modelNormalized');
    let bufLen = buffer.get('length');
    let modLen = model.get('length');

    if (!modLen) {
      return;
    }

    let contentSize = scrollable.height();
    let trHeight = scroller.children('.ui-table__tr').height();
    let target = Math.floor(contentSize / trHeight);

    if (isNaN(trHeight)) { // first row!
      buffer.pushObject(Ember.Object.create({
        key: Ember.generateGuid(this),
        tr: [],
        index: bufLen,
        model: model.objectAt(bufLen)
      }));

      this.detachScrollListener();

      return;
    }
    else if (target - bufLen > 0) { // We have surplus in model that can fill buffer
      for (let index = buffer.get('length'); target - index; index = buffer.get('length')) {
        buffer.pushObject(Ember.Object.create({
          key: Ember.generateGuid(this),
          tr: [],
          index: index,
          model: model.objectAt(index)
        }));

        cursor.end++;
      }

      this.detachScrollListener();

      return;
    }
    else if (scrollable.prop('scrollHeight') > scrollable.prop('clientHeight') + trHeight * OVERSCAN_ROWS) { // Ahh we're overflowing !!
      this.attachScrollListener();

      return; // really, do nothing
    }

    this.get('scroller.all').height(trHeight * modLen);

    this.$().css('visibility', '');

    this.get('table').measure();
  },

  didInsertElement() {
    this._super(...arguments);

    this.$().css('visibility', 'hidden');
    this.resizeHeight();
  },

  attachScrollListener() {
    let tbody = this.$().get(0);
    let unfroze = this.get('scroller.unfroze').get(0);
    let froze = this.get('scroller.froze').get(0);
    let lastScrollTop = 0;

    this.$().on('ps-scroll-y', throttle(evt => {
      let buffer = this.get('buffer');
      //let bufLen = buffer.get('length');
      let cursors = this.get('bufferCursors');
      let model = this.get('modelNormalized');

      let direction = evt.target.scrollTop - lastScrollTop;

      let ref = tbody;

      lastScrollTop = evt.target.scrollTop;

      function increase(pos) {
        return function(index, value) {
          return parseFloat(value) + pos.height;
        };
      }

      function decrease(pos) {
        return function(index, value) {
          return parseFloat(value) - pos.height;
        };
      }

      while (true) {
        let refPos = ref.getBoundingClientRect();
        let first = unfroze.firstElementChild;
        let firstPos = first.getBoundingClientRect();
        let last = unfroze.lastElementChild;
        let lastPos = last.getBoundingClientRect();

        // if top most one is out of viewport
        if (direction > 0 && lastPos.bottom < refPos.bottom/* + lastPos.height * OVERSCAN_ROWS*/) {
          // TODO
          // shouldn't moving just one row,
          // should be all rows belong to one buffer entry
          // TODO
          // moving the node has some real performance cost to it
          // when trying to scroll really fast
          Ember.run.begin();

          Ember.$(froze.firstElementChild).insertAfter(froze.lastElementChild);
          Ember.$(unfroze).add(froze)
            .css('margin-top', increase(firstPos))
            .css('height', decrease(firstPos));

          cursors.end++;
          buffer.pushObject(buffer.shiftObject()).setProperties({
            tr: [],
            index: cursors.end,
            model: model.objectAt(cursors.end)
          });
          cursors.start++;
          Ember.run.end();

          continue;
        }

        if (direction < 0 && firstPos.top > refPos.top) {
          Ember.run.begin();

          Ember.$(froze.lastElementChild).insertBefore(froze.firstElementChild);
          Ember.$(unfroze).add(froze)
            .css('margin-top', decrease(lastPos))
            .css('height', increase(lastPos));

          cursors.start--;
          buffer.unshiftObject(buffer.popObject()).setProperties({
            tr: [],
            index: cursors.start,
            model: model.objectAt(cursors.start)
          });
          cursors.end--;
          Ember.run.end();

          continue;
        }

        if (direction === 0) {
          // refresh models right at the cursor
          /* jshint loopfunc: true */
          Ember.run(buffer, buffer.forEach, item => {
            item.set('model', model.objectAt(item.index));
          });
        }

        break;
      }
    }));
  },

  detachScrollListener() {
    this.$().off('ps-scroll-y');
  }
}).reopenClass({
  positionalParams: ['model']
});
