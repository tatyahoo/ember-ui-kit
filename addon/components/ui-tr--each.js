import Ember from 'ember';
import layout from '../templates/components/ui-tr--each';

const BufferedArrayProxy = Ember.ArrayProxy.extend({
  bufferLength: null,

  length: Ember.computed.readOnly('bufferLength')
});

export default Ember.Component.extend({
  classNames: 'ui-tr--each',
  layout,

  /**
   * @attribute {} model
   */
  model: null,

  /**
   * @attribute {} key
   */
  key: null,

  // TODO flatten tree model
  modelNormalized: Ember.computed.readOnly('model'),

  rowHeight: Ember.computed(function() {
    return this.$('.ui-tr--measure .ui-tr').height();
  }).readOnly(),

  bufferSize: Ember.computed('rowHeight', function() {
    let screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    let rowHeight = this.get('rowHeight');

    return Math.ceil(screenHeight / rowHeight);
  }),
  bufferStart: 0,
  buffer: Ember.computed('modelNormalized.[]', 'bufferStart', 'bufferSize', function() {
    let model = this.get('modelNormalized');
    let start = this.get('bufferStart');
    let size = this.get('bufferSize');

    return model.slice(start, start + size);
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);

    let length = this.get('model.length');
    let rowHeight = this.get('rowHeight');
    let bodyHeight = this.$().height();

    let block = this.$().parentsUntil('.ui-table--v2', '.ui-tbody__block');

    block.css({
      marginTop: 0,
      height: length * rowHeight
    });

    this.$().parentsUntil('.ui-table--v2', '.ui-tbody').on('scroll', evt => {
      let scrollTop = evt.target.scrollTop;
      let start = Math.floor(scrollTop / rowHeight);

      block.css({
        marginTop: rowHeight * start,
        height: rowHeight * (length - start)
      });

      Ember.run(this, this.set, 'bufferStart', start);
    });
  }

}).reopenClass({
  positionalParams: ['model']
});
