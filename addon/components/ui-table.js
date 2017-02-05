import Ember from 'ember';
import layout from '../templates/components/ui-table';

import ResizeAware from '../mixins/resize-aware';
import Composable from '../mixins/composable';

import { getBox } from '../utils/dom';

export default Ember.Component.extend(ResizeAware, Composable, {
  classNames: 'ui-table',
  layout,

  thead: null,
  tbody: null,
  tfoot: null,

  willInsertElement() {
    this._super(...arguments);

    this.$().on('register.all', evt => {
      evt.stopPropagation();

      Ember.run.scheduleOnce('afterRender', this, this.measure);
    });
    this.$().on('register.thead register.tbody register.tfoot', (evt, component) => {
      evt.stopPropagation();

      this.set(evt.namespace, component);
    });
  },

  measure() {
    let scrollables = this.$('.ui-scrollable');

    let mOld = this._super(...arguments);

    mOld.scrollWidth = mOld.scrollWidth || Array.from({ length: scrollables.length }).fill(0);
    mOld.scrollHeight = mOld.scrollHeight || new Array({ length: scrollables.length }).fill(0);

    let mNew = {
      scrollWidth: scrollables.toArray().map(el => el.scrollWidth),
      scrollHeight: scrollables.toArray().map(el => el.scrollHeight)
    };

    let wLen = Math.max(mNew.scrollWidth.length, mOld.scrollWidth.length);
    let hLen = Math.max(mNew.scrollHeight.length, mOld.scrollHeight.length);
    let resized = false;

    for (let index = 0; index < wLen; index++) {
      if (mOld.scrollWidth[index] !== mNew.scrollWidth[index]) {
        resized = true;
        Ember.run.scheduleOnce('afterRender', this, this.triggerResizeWidth, mNew, mOld);
        break;
      }
    }

    for (let index = 0; index < hLen; index++) {
      if (mOld.scrollHeight[index] !== mNew.scrollHeight[index]) {
        resized = true;
        Ember.run.scheduleOnce('afterRender', this, this.triggerResizeHeight, mNew, mOld);
        break;
      }
    }

    if (resized) {
      Ember.run.scheduleOnce('afterRender', this, this.triggerResize, mNew, mOld);
    }

    Ember.assign(this.measurements, mNew);

    return mOld;
  },

  didInsertElement() {
    this._super(...arguments);

    let left = this.$('.ui-table__tbody .ui-table__froze');
    let top = this.$('.ui-table__thead .ui-table__unfroze');
    let bottom = this.$('.ui-table__tfoot .ui-table__unfroze');
    let center = this.$('.ui-table__tbody .ui-table__unfroze');

    left.on('ps-scroll-y', evt => {
      center.scrollTop(evt.currentTarget.scrollTop);
    });

    center.on('ps-scroll-x', evt => {
      left.add(bottom).add(top)
        .scrollLeft(evt.currentTarget.scrollLeft);
    });

    center.on('ps-scroll-y', evt => {
      left.add(bottom).add(top)
        .scrollTop(evt.currentTarget.scrollTop);
    });

    top.on('ps-scroll-x', evt => {
      center.add(bottom)
        .scrollLeft(evt.currentTarget.scrollLeft);
    });

    bottom.on('ps-scroll-x', evt => {
      center.add(top)
        .scrollLeft(evt.currentTarget.scrollLeft);
    });
  },

  resize() {
    this.$('.ui-scrollable').each(function() {
      Ember.$(this).perfectScrollbar('update');
    });
  },

  resizeHeight() {
    let thead = this.get('thead');
    let tbody = this.get('tbody');
    let tfoot = this.get('tfoot');

    thead && thead.trigger('resizeHeight');
    tbody && tbody.trigger('resizeHeight');
    tfoot && tfoot.trigger('resizeHeight');

    let heights = {
      thead: !thead ? 0 : thead.$('.ui-table__froze, .ui-table__unfroze .ui-scrollable__scroller')
        .toArray()
        .map(element => element.scrollHeight)
        .reduce((left, right) => Math.max(left, right), 0),
      tbody: !tbody ? 0 : tbody.$('.ui-table__froze .ui-scrollable__scroller, .ui-table__unfroze .ui-scrollable__scroller')
        .toArray()
        .map(element => element.scrollHeight)
        .reduce((left, right) => Math.max(left, right), 0),
      tfoot: !tfoot ? 0 : tfoot.$('.ui-table__froze .ui-scrollable__scroller, .ui-table__unfroze .ui-scrollable__scroller')
        .toArray()
        .map(element => element.scrollHeight)
        .reduce((left, right) => Math.max(left, right), 0),
    };

    let headBox = getBox(thead && thead.element);
    let footBox = getBox(tfoot && tfoot.element);

    let headHeight = (heights.thead + headBox.padding.top + headBox.padding.bottom + headBox.border.top + headBox.border.bottom) || 0;
    let footHeight = (heights.tfoot + footBox.padding.top + footBox.padding.bottom + footBox.border.top + footBox.border.bottom) || 0;

    this.$('.ui-table__tbody').css({
      top: headHeight,
      bottom: footHeight
    });
    this.$('.ui-table__thead').css({
      height: headHeight
    });
    this.$('.ui-table__tfoot').css({
      height: footHeight
    });
    this.$().css({
      height: heights.tbody + headHeight + footHeight
    });
  },

  resizeWidth(mNew, mOld) {
    let thead = this.get('thead');
    let tbody = this.get('tbody');
    let tfoot = this.get('tfoot');

    thead && thead.trigger('resizeWidth', mNew, mOld);
    tbody && tbody.trigger('resizeWidth', mNew, mOld);
    tfoot && tfoot.trigger('resizeWidth', mNew, mOld);
  },

  //scrollables: Ember.computed(function() {
  //  return this.$('.ui-table__scrollable')
  //    .not('.ui-table__thead__scrollable.ui-table__froze')
  //    .not('.ui-table__tfoot__scrollable.ui-table__froze');
  //}).readOnly(),

  //scrollTarget: null,
  //scrollTop: 0,
  //scrollLeft: 0,
  //scrollSync: task(function *() {
  //  let id;
  //  let context = this;

  //  id = requestAnimationFrame(function update() {
  //    context.scrollUpdate();

  //    id = requestAnimationFrame(update);
  //  });

  //  try {
  //    yield timeout(150);

  //    cancelAnimationFrame(id);

  //    context.scrollUpdate();
  //  }
  //  finally {
  //    cancelAnimationFrame(id);
  //  }
  //}).drop(),
  //scrollUpdate() {
  //  let scrollables = this.get('scrollables');

  //  scrollables.add().not(this.get('scrollTarget'))
  //    .scrollTop(this.get('scrollTop'))
  //    .scrollLeft(this.get('scrollLeft'));
  //},

  //resize() {
  //  let sizables = [ this, this.get('thead'), this.get('tbody'), this.get('tfoot') ];

  //  Ember.run.schedule('render', this, function() {
  //    if (!this.isDestroying) {
  //      sizables.forEach(component => {
  //        Ember.tryInvoke(component, 'measure');
  //      });
  //    }
  //  });
  //  Ember.run.schedule('afterRender', this, function() {
  //    if (!this.isDestroying) {
  //      let components = sizables.slice(1);

  //      components.forEach(component => {
  //        Ember.tryInvoke(component, 'resize');
  //      });

  //      this.$().height(components.reduce((accum, component) => {
  //        return accum + (Ember.get(component || {}, 'measurements.scrollHeight') || 0);
  //      }, 0));
  //    }
  //  });
  //},

  //plugins: {
  //  register: {
  //    render() {
  //      this.$().on('register.thead register.tbody register.tfoot', (evt, component) => {
  //        Ember.run.join(this, this.set, evt.namespace, component);
  //      });
  //    },

  //    destroy() {
  //      this.$().off('register.thead register.tbody register.tfoot');
  //    }
  //  },

  //  scroll: {
  //    render() {
  //    },

  //    afterRender() {
  //      let scrollables = this.get('scrollables');
  //      let sync = this.get('scrollSync');

  //      let vertical = scrollables.add()
  //        .filter('.ui-table__tbody__scrollable');

  //      let horizontal = scrollables.add()
  //        .filter('.ui-table__unfroze');

  //      // The point here is to desynchronize upstream and downstream
  //      // upstream is where scroll event updates scroll position
  //      // downstream is where another "thread" updates scroll position

  //      vertical.on('scroll', Ember.run.bind(this, function(evt) {
  //        this.setProperties({
  //          scrollTarget: evt.currentTarget,
  //          scrollTop: evt.currentTarget.scrollTop
  //        });

  //        sync.perform();
  //      }));

  //      horizontal.on('scroll', Ember.run.bind(this, function(evt) {
  //        this.setProperties({
  //          scrollTarget: evt.currentTarget,
  //          scrollLeft: evt.currentTarget.scrollLeft
  //        });

  //        sync.perform();
  //      }));
  //    },

  //    destroy() {
  //      this.$('.ui-table__scrollable').off('scroll');
  //    }
  //  },

  //}
});
