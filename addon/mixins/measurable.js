import Ember from 'ember';

export default Ember.Mixin.create({
  measurements: Ember.computed(function() {
    let rect = this.element.getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      scrollWidth: this.element.scrollWidth,
      scrollHeight: this.element.scrollHeight
    };
  }).readOnly(),

  measure() {
    this.notifyPropertyChange('measurements');
    this.get('measurements');
  }
});
