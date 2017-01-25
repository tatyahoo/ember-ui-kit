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

  buffer: construct(Ember.A).readOnly(),
  //bufferCursors: construct(Object).readOnly(),
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
    let model = this.get('model');
    let bufLen = Ember.get(buffer, 'length');
    let modLen = Ember.get(model, 'length');

    let table = this.get('table.measurements.height') || 0;
    let thead = this.get('table.thead.measurements.height') || 0;
    let tfoot = this.get('table.tfoot.measurements.height') || 0;

    let tr = scroller.children(':first').height();
    let target = Math.floor(table / tr);

    if (isNaN(target)) {
      buffer.pushObject({
        tr: [],
        index: bufLen,
        model: model[bufLen] || model.objectAt(bufLen)
      });
    }
    else if (target - bufLen > 0) {
      for (let index = buffer.get('length'); target - index; index = buffer.get('length')) {
        buffer.pushObject({
          tr: [],
          index: index,
          model: model[index] || model.objectAt(index)
        });

        cursor.end++;
      }
    }

    Ember.run.schedule('afterRender', this, function() {
      // TODO handle uneven row height
      scroller.height(tr * modLen - parseFloat(scroller.css('margin-top')));

      this.$().css({
        marginTop: thead,
        marginBottom: tfoot,
        height: Math.max(0, table - thead - tfoot)
      });
    });
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
          let model = this.get('model');

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
                tr: [],
                index: cursors.end,
                model: model[cursors.end] || model.objectAt(cursors.end)
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
                tr: [],
                index: cursors.start,
                model: model[cursors.start] || model.objectAt(cursors.start)
              });
              cursors.end--;

              continue;
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
