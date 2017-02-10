import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody-each';

import Body from './tbody';

import { throttle } from '../../utils/raf';
import { construct } from '../../utils/computed';
import { observerOnce } from '../../utils/run';

// Over scan is number of rows
// ahead of direction of scroll
const OVERSCAN_ROWS = 10;

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

//
// TODO Ideas on how to improve performance
//
// - Overscan and render paged rows in larger chunks
// - Rows scrolled out of viewport can be "frozen" and has their dimensions cached
//
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
    let target = Math.min(Math.floor(contentSize / trHeight) + OVERSCAN_ROWS, modLen);

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
      this.detachScrollListener();
      this.attachScrollListener();
    }

    Ember.run.schedule('afterRender', this, function() {
      let contentTop = parseFloat(scroller.css('margin-top'));

      this.get('scroller.all').height(trHeight * modLen - contentTop);

      this.$().css('visibility', '');

      this.get('table').measure();
    });
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

    let buffer = this.get('buffer');
    let cursors = this.get('bufferCursors');
    let model = this.get('modelNormalized');

    let ref = tbody;

    this.$().on('ps-scroll-up', throttle(() => {
      let refPos = ref.getBoundingClientRect();
      let last = unfroze.lastElementChild;
      let lastPos = last.getBoundingClientRect();

      // if top most one is out of viewport
      while (unfroze.firstElementChild.getBoundingClientRect().top > refPos.top) {
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
      }
    }));

    this.$().on('ps-scroll-down', throttle(() => {
      let refPos = ref.getBoundingClientRect();
      let first = unfroze.firstElementChild;
      let firstPos = first.getBoundingClientRect();

      // if top most one is out of viewport
      while (unfroze.lastElementChild.getBoundingClientRect().bottom < refPos.bottom/* + lastPos.height * OVERSCAN_ROWS*/) {
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
      }
    }));
  },

  detachScrollListener() {
    this.$().off('ps-scroll-y');
  }
}).reopenClass({
  positionalParams: ['model']
});
