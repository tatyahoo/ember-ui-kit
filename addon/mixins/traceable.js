import Ember from 'ember';

class Tracer {
  constructor(label) {
    this.label = String(label);
  }
}

Tracer.symbol = Symbol('tracer');

let hash = {};

Ember.runInDebug(function() {
  hash = {
    init() {
      this._super(...arguments);

      this[Tracer.symbol] = new Tracer(this);
    },

    destroy() {
      this._super(...arguments);

      this[Tracer.symbol] = null;
    }
  };
});


//
// Utility mixin to help isolating memory leak.
//
// Usage:
//
// Ember.Object.extend(Traceable, { ... });
//
// Locate the tracer object in devtools memory tab by
// Tracer name.
// Differentiate tracer by it's label.
//
export default Ember.Mixin.create(hash);
