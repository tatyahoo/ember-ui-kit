import Ember from 'ember';

export default Ember.Mixin.create({
  measurements: Ember.computed(function() {
    let el = this.$();

    if (!el) {
      return {
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0,
        scrollWidth: 0,
        scrollHeight: 0
      };
    }

    let [ froze, unfroze ] = this.$('.ui-table__scroller');

    return {
      width: el.width(),
      height: el.height(),
      innerWidth: el.innerWidth(),
      innerHeight: el.innerHeight(),
      outerWidth: el.outerWidth(),
      outerHeight: el.outerHeight(),
      scrollWidth: Math.max(froze.scrollWidth, unfroze.scrollWidth),
      scrollHeight: Math.max(froze.scrollHeight, unfroze.scrollHeight)
    };
  }).readOnly(),

  measure() {
    this.notifyPropertyChange('measurements');
    this.get('measurements');
  }
});
