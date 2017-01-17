import Ember from 'ember';
import layout from '../templates/components/ui-resizable';

import Pluggable from '../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-resizable',
  layout,

  // attrs {
  options: null,
  // attrs }

  plugins: {
    ui: {
      render() {
        this.$().resizable(Ember.assign({}, this.get('options')));
      },

      destroy() {
        this.$().resizable('destroy');
      }
    }
  }
});
