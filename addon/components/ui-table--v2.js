import Ember from 'ember';
import layout from '../templates/components/ui-table--v2';

export default Ember.Component.extend({
  classNames: 'ui-table--v2',
  layout,

  vScroller: Ember.computed(function() {
    return this.$('[data-table-block="variable"]');
  }).readOnly(),

  hScroller: Ember.computed('vScroller', function() {
    return this.get('vScroller').find('.ui-tbody__content');
  }).readOnly(),

  contentBlocks: Ember.computed(function() {
    return this.$('.ui-thead__content, .ui-tbody__content, .ui-tfoot__content');
  }).readOnly(),

  init() {
    this._super(...arguments);

    this.onScrollVertical = Ember.run.bind(this, this.onScrollVertical);
    this.onScrollHorizontal = Ember.run.bind(this, this.onScrollHorizontal);
  },

  didRender() {
    this._super(...arguments);

    let ns = this.get('elementId');

    //
    // Clean up and rebind
    //

    this.get('vScroller').off(`scroll.${ns}`);
    this.get('hScroller').off(`scroll.${ns}`).off(`mousewheel.${ns}`);

    this.notifyPropertyChange('contentBlocks');
    this.notifyPropertyChange('vScroller');
    this.notifyPropertyChange('hScroller');

    this.get('vScroller').off(`scroll.${ns}`).on(`scroll.${ns}`, this.onScrollVertical);
    this.get('hScroller').off(`scroll.${ns}`).on(`scroll.${ns}`, this.onScrollHorizontal);
  },

  willDestroyElement() {
    this._super(...arguments);

    let ns = this.get('elementId');

    this.get('vScroller').off(`scroll.${ns}`);
    this.get('hScroller').off(`scroll.${ns}`);
  },

  onScrollVertical() {
    let ns = this.get('elementId');

    this.get('hScroller').off(`mousewheel.${ns}`);
  },

  onScrollHorizontal() {
    let ns = this.get('elementId');

    let contents = this.get('contentBlocks');
    let body = contents.filter('.ui-tbody__content');
    let scrollLeft = body.prop('scrollLeft');
    let scrollWidth = body.prop('scrollWidth');
    let clientWidth = body.prop('clientWidth');

    contents.each(function() {
      this.scrollLeft = scrollLeft;
    });

    this.get('hScroller')
      .off(`scroll.${ns}`)
      .on(`mousewheel.${ns}`, evt => {
        if (!evt.deltaX) {
          return;
        }

        scrollLeft = Math.max(0, scrollLeft + evt.deltaX * evt.deltaFactor);
        scrollLeft = Math.min(scrollWidth - clientWidth, scrollLeft);

        evt.preventDefault();

        contents.each(function() {
          this.scrollLeft = scrollLeft;
        });
      });
  }

});
