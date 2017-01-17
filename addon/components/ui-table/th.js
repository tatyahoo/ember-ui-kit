import Ember from 'ember';
import layout from '../../templates/components/ui-table/th';

import Pluggable from '../../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__th',
  classNameBindings: 'columnClass',
  layout,

  // attrs {
  width: null,
  span: 1,

  // @private
  table: null,
  // @private
  thead: null,
  // attrs }

  columnClass: Ember.computed.oneWay('elementId'),
  columnWidth: Ember.computed('width', 'span', 'thead.{availableSpan,availableWidth}', function() {
    let width = this.get('width');

    if (typeof width === 'number') {
      return width;
    }

    let availableSpan = this.get('thead.availableSpan');
    let availableWidth = this.get('thead.availableWidth');

    let span = this.get('span');

    return availableWidth * span / availableSpan;
  }).readOnly(),

  childHeaderList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  isLeafHeader: Ember.computed.empty('childHeaderList'),

  plugins: {
    register: {
      render() {
        let headers = this.get('childHeaderList');

        this.$().on('register.th', '.ui-table__th', (evt, th) => {
          Ember.run.join(headers, headers.pushObject, th);

          return false;
        });
      },

      afterRender() {
        this.$().trigger('register.th', this);
      },

      willDestroyElement() {
        this.$().trigger('unregister.th', this);
      }
    }
  }
});
