import Ember from 'ember';

export default Ember.Mixin.create({
  measurements: Ember.computed(function() {
    let el = this.$();

    return {
      width: el.width(),
      height: el.height(),
      outerWidth: el.outerWidth(),
      outerHeight: el.outerHeight(),
      scrollWidth: el.prop('scrollWidth'),
      scrollHeight: el.prop('scrollHeight')
    };
  }).readOnly(),

  measure() {
    this.notifyPropertyChange('measurements');
    this.get('measurements');
  }
});
