import Ember from 'ember';
import TableHead from './ui-thead';
import layout from '../templates/components/ui-thead--fixed';

export default TableHead.extend({
  classNames: 'ui-thead--fixed',
  layout,

  didInsertElement() {
    this._super(...arguments);

    let table = this.$().closest('.ui-table--v2');

    this.$().off('sortupdate').on('sortupdate', (evt,  { item }) => {
      let ordered = this.$('[data-column-id]')
        .toArray()
        .map(element => (Ember.$(element).attr('data-column-id')));
      let moved = item.find('[data-column-id]')
        .addBack()
        .filter('[data-column-id]')
        .toArray()
        .map(element => (Ember.$(element).attr('data-column-id')));
      let insertionPoint = ordered[ordered.indexOf(moved[moved.length - 1]) + 1];

      table.find('.ui-tr').each(function() {
        let tr = Ember.$(this);

        if (typeof insertionPoint !== 'undefined') {
          let before = tr.find(`[data-column-id="${insertionPoint}"]`);

          moved.reverse().map(id => tr.find(`[data-column-id="${id}"]`)).reduce((prev, curr) => {
            curr.insertBefore(prev);

            return curr;
          }, before);
        }
        else {
          moved.map(id => tr.find(`[data-column-id="${id}"]`)).forEach(element => {
            Ember.$(element).appendTo(tr);
          });
        }
      });
    });
  }
});
