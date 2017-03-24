import Ember from 'ember';

export function event([ fn ], { echo, selfOnly, extract }) {
  return function eventHelper(evt) {
    if (selfOnly && evt.target !== evt.currentTarget) {
      return;
    }

    if (echo) {
      Ember.run.next(function() {
        let elements = document.elementsFromPoint(evt.pageX, evt.pageY);

        Ember.$(elements[Number(echo)]).trigger(evt.type);
      });
    }

    if (extract) {
      return fn(Ember.get(evt, extract));
    }

    return fn();
  };
}

export default Ember.Helper.helper(event);
