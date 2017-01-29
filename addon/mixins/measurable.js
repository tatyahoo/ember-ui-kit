import Ember from 'ember';

export default Ember.Mixin.create({
  measurements: Ember.computed(function() {
    let el = this.$();
    let [ froze, unfroze ] = this.$('.ui-table__scroller');

    return {
      width: el.width(),
      height: el.height(),
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
