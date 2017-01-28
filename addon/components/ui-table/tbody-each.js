import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody-each';

import Body from './tbody';

import { throttle } from '../../utils/raf';
import { construct } from '../../utils/computed';

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

  buffer: construct(Ember.A).readOnly(),
  bufferCursors: Ember.computed(function() {
    return { start: 0, end: 0 };
  }).readOnly(),

  scroller: Ember.computed(function() {
    return this.$('.ui-table__scroller:last');
  }).readOnly(),

  scrollerSiblings: Ember.computed(function() {
    return this.$().siblings('.ui-table__thead, .ui-table__tfoot');
  }).readOnly(),

  resize() {
    let scroller = this.get('scroller');

    let cursor = this.get('bufferCursors');
    let buffer = this.get('buffer');
    let model = this.get('modelNormalized');
    let bufLen = buffer.get('length');
    let modLen = model.get('length');

    let table = this.get('table.measurements.height') || 0;

    let tr = scroller.children(':first').height();
    let target = Math.floor(table / tr);

    if (isNaN(target)) {
      buffer.pushObject(Ember.Object.create({
        guid: Ember.generateGuid(this),
        tr: [],
        index: bufLen,
        model: model.objectAt(bufLen)
      }));
    }
    else if (target - bufLen > 0) {
      for (let index = buffer.get('length'); target - index; index = buffer.get('length')) {
        buffer.pushObject(Ember.Object.create({
          guid: Ember.generateGuid(this),
          tr: [],
          index: index,
          model: model.objectAt(index)
        }));

        cursor.end++;
      }
    }

    // TODO
    // handle uneven row height
    // need to solve this problem before locking column
    scroller.height(tr * modLen - parseFloat(scroller.css('margin-top')));

    this._super(...arguments);
  },

  plugins: {
    row: {
      render() {
        let buffer = this.get('buffer');

        this.$().on('register.tr', (evt, tr) => {
          buffer.get('lastObject').tr.push(tr);
        });
      },

      destroy() {
        this.$().off('register.tr');
      }
    },

    select: {
      render() {
        this.addObserver('model.[]', () => {
          this.$().trigger('scroll');
        });
      }
    },

    scroll: {
      render() {
        let scroller = this.get('scroller').get(0);
        let tbody = this.$().get(0);
        let lastScrollTop = 0;
        let lastScrollLeft = 0;

        this.$().on('scroll', throttle(evt => {
          let buffer = this.get('buffer');
          let bufLen = buffer.get('length');
          let cursors = this.get('bufferCursors');
          let model = this.get('modelNormalized');

          let direction = evt.target.scrollTop - lastScrollTop;

          let ref = tbody;

          lastScrollTop = evt.target.scrollTop;
          lastScrollLeft = evt.target.scrollLeft;

          this.get('scrollerSiblings').scrollLeft(evt.target.scrollLeft);

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
            let first = scroller.firstElementChild;
            let firstPos = first.getBoundingClientRect();
            let last = scroller.lastElementChild;
            let lastPos = last.getBoundingClientRect();

            // if top most one is out of viewport
            if (direction > 0 && lastPos.bottom < refPos.bottom) {
              // TODO
              // shouldn't moving just one row,
              // should be all rows belong to one buffer entry
              Ember.$(first).insertAfter(last);
              Ember.$(scroller)
                .css('margin-top', increase(firstPos))
                .css('height', decrease(firstPos));

              cursors.end++;
              Ember.run(Ember, Ember.setProperties, buffer.objectAt(cursors.start % bufLen), {
                index: cursors.end,
                model: model.objectAt(cursors.end)
              });
              cursors.start++;

              continue;
            }

            if (direction < 0 && firstPos.top > refPos.top) {
              Ember.$(last).insertBefore(first);
              Ember.$(scroller)
                .css('margin-top', decrease(lastPos))
                .css('height', increase(lastPos));

              cursors.start--;
              Ember.run(Ember, Ember.setProperties, buffer.objectAt(cursors.end % bufLen), {
                index: cursors.start,
                model: model.objectAt(cursors.start)
              });
              cursors.end--;

              continue;
            }

            if (direction === 0) {
              // refresh models right at the cursor
              Ember.run(buffer, buffer.forEach, item => {
                item.set('model', model.objectAt(item.index));
              });
            }

            break;
          }
        }));
      }
    }
  }
}).reopenClass({
  positionalParams: ['model']
});
