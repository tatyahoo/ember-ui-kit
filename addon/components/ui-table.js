import Ember from 'ember';
import layout from '../templates/components/ui-table';

import Pluggable from '../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table',
  layout,

  thead: null,
  tbody: null,
  tfoot: null,

  plugins: {
    register: {
      render() {
        this.$().on('register.thead register.tbody register.tfoot', (evt, component) => {
          Ember.run.join(this, this.set, evt.namespace, component);
        });
      }
    }
  }
});
