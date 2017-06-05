import Ember from 'ember';

/* global elementResizeDetectorMaker */
let detector = elementResizeDetectorMaker({
  strategy: 'scroll'
});

export default Ember.Mixin.create(Ember.Evented, {
  classNames: 'ui-x-resize-aware',

  didInsertElement() {
    this._super(...arguments);

    detector.listenTo(this.element, this.measure = Ember.run.bind(this, this.measure));
  },

  triggerResizeWidth(mNew, mOld) {
    if (!this.isDestroying) {
      this.trigger('resizeWidth', mNew, mOld);
    }
  },

  triggerResizeHeight(mNew, mOld) {
    if (!this.isDestroying) {
      this.trigger('resizeHeight', mNew, mOld);
    }
  },

  triggerResize(mNew, mOld) {
    if (!this.isDestroying) {
      this.trigger('resize', mNew, mOld);
    }
  },

  measure() {
    let el = this.$();

    let mOld = this.measurements || {};
    let mNew = this.measurements = {
      width: el.width(),
      height: el.height(),
      innerWidth: el.innerWidth(),
      innerHeight: el.innerHeight(),
      outerWidth: el.outerWidth(),
      outerHeight: el.outerHeight()
    };
    let resized = false;

    if (mOld.width !== mNew.width || mOld.innerWidth !== mNew.innerWidth || mOld.outerWidth !== mNew.outerWidth) {
      resized = true;
      Ember.run.scheduleOnce('afterRender', this, this.triggerResizeWidth, mNew, mOld);
    }

    if (mOld.height !== mNew.height || mOld.innerHeignt !== mNew.innerHeignt || mOld.outerHeignt !== mNew.outerHeignt) {
      resized = true;
      Ember.run.scheduleOnce('afterRender', this, this.triggerResizeHeight, mNew, mOld);
    }

    if (resized) {
      Ember.run.scheduleOnce('afterRender', this, this.triggerResize, mNew, mOld);
    }

    return mOld;
  },

  willDestroyElement() {
    this._super(...arguments);

    detector.removeListener(this.element, this.measure);
  }
});
