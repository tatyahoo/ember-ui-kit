import Ember from 'ember';
import DS from 'ember-data';

import SelectableComputed from './-selectable/computed';
import Selectable from './-selectable/model';

export default function selectable() {
  return new SelectableComputed(function(key) {
    let meta = this.constructor.metaForProperty(key).selectable;
    let from =
      typeof meta.from === 'string' ?  this.get(meta.from) :
      typeof meta.from === 'function' ? meta.from.call(this) :
      meta.from;

    return Selectable.create({
      meta,

      list: DS.PromiseArray.create({
        promise: Ember.RSVP.resolve(from).then(id => Ember.A(id && id.slice()))
      })
    });
  });
}
