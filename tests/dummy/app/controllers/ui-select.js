import Ember from 'ember';

import selectable from 'ember-ui-kit/computed/selectable';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),

  trimmed: Ember.computed('application.model', function() {
    return this.get('application.model').slice(0, 10);
  }).readOnly(),

  users: selectable()
    .from('trimmed')
    .limit(1)
    .select(0),
});
