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
    let scrollables = this.$('.ui-scrollable__viewport');

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

    Object.assign(this.measurements, mNew);

    return mOld;
  },

  didInsertElement() {
    this._super(...arguments);

    let left = this.$('.ui-table__tbody .ui-table__froze .ui-scrollable__viewport');
    let top = this.$('.ui-table__thead .ui-table__unfroze .ui-scrollable__viewport');
    let bottom = this.$('.ui-table__tfoot .ui-table__unfroze .ui-scrollable__viewport');
    let center = this.$('.ui-table__tbody .ui-table__unfroze .ui-scrollable__viewport');

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
      thead: !thead ? 0 : thead.$('.ui-table__th')
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

    let tableBox = getBox(this.element);
    let headBox = getBox(thead && thead.element);
    let footBox = getBox(tfoot && tfoot.element);

    let headHeight = (heights.thead + headBox.padding.top + headBox.padding.bottom + headBox.border.top + headBox.border.bottom) || 0;
    let footHeight = (heights.tfoot + footBox.padding.top + footBox.padding.bottom + footBox.border.top + footBox.border.bottom) || 0;

    this.$('.ui-table__tbody').css({
      top: headHeight + tableBox.padding.top,
      bottom: footHeight + tableBox.padding.bottom
    });
    this.$('.ui-table__thead').css({
      top: tableBox.padding.top,
      height: headHeight
    });
    this.$('.ui-table__tfoot').css({
      height: footHeight,
      bottom: tableBox.padding.bottom
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
  }
});
