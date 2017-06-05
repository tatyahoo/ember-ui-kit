import Ember from 'ember';
import layout from '../templates/components/ui-th';

export default Ember.Component.extend({
  classNames: 'ui-th',
  layout,

  attributeBindings: [
    'width:data-column-width',
    'column:data-column-id',
    'children:data-column-children'
  ],

  /**
   * @attribute {} width
   */
  width: null,

  /**
   * @attribute {} column
   */
  column: null,

  /**
   * @attribute {} children
   */
  children: null,

  didInsertElement() {
    this._super(...arguments);

    //this.$()
    //  .attr('data-column-width', this.get('width'))
    //  .attr('data-children', (index, prev) => (prev || 0))
    //  .parent()
    //  .closest('.ui-th, .ui-thead')
    //  .attr('data-children', (index, prev) => (Number(prev || 0) + 1));

    let { TEXT_NODE } = document;

    // TODO do this in compile
    Ember.$(this.element.parentNode.childNodes).each(function() {
      if (this.nodeType === TEXT_NODE) {
        this.data = this.data.trim();
      }
    });
  }
});
