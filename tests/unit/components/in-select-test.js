import { moduleForComponent, test } from 'ember-qunit';

import Ember from 'ember';

moduleForComponent('in-select', 'Unit | Component | in-select', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('#multiple', function(assert) {
  let subject = Ember.run(this, 'subject');

  let multiple = [
    [],
    Ember.A(),
    Ember.ArrayProxy.create({})
  ];

  let single = [
    undefined,
    null,
    1,
    'abc',
    {},
    true,
    false
  ];

  multiple.forEach(check => {
    subject.set('value', check);

    assert.equal(subject.get('multiple'), true);
  });

  single.forEach(check => {
    subject.set('value', check);

    assert.equal(subject.get('multiple'), false);
  });
});

test('#list', async function(assert) {
  let subject = Ember.run(this, 'subject');
  let content = [
    'hello',
    'world'
  ];

  let checks = Ember.run(function() {
    return [ content, Ember.A(content), Ember.ArrayProxy.create({ content }) ]
      .reduce((accum, check) => {
        let promise = Ember.RSVP.resolve(check);

        return accum.concat([ check ], function() { return check; }, promise, function() { return promise; });
      }, []);
  });

  while (checks.length) {
    Ember.run(subject, subject.set, 'from', checks.shift());

    assert.deepEqual((await subject.get('list')).toArray(), content);
  }
});

test('#isSelected', function(assert) {
  let subject = Ember.run(this, 'subject');

  subject.set('value', 1)

  assert.equal(subject.get('isSelected')(1), true);
  assert.equal(subject.get('isSelected')(2), false);

  subject.set('value', false)

  assert.equal(subject.get('isSelected')(false), true);
  assert.equal(subject.get('isSelected')(true), false);

  subject.set('value', [ 1 ])

  assert.equal(subject.get('isSelected')(1), true);
  assert.equal(subject.get('isSelected')(2), false);

  subject.set('value', [ false ])

  assert.equal(subject.get('isSelected')(false), true);
  assert.equal(subject.get('isSelected')(true), false);

  subject.set('key', 'id');

  subject.set('value', { id: 1 })

  assert.equal(subject.get('isSelected')({ id: 1 }), true);
  assert.equal(subject.get('isSelected')({ id: 2 }), false);

  subject.set('value', { id: false })

  assert.equal(subject.get('isSelected')({ id: false }), true);
  assert.equal(subject.get('isSelected')({ id: true }), false);

  subject.set('value', [ { id: 1 } ])

  assert.equal(subject.get('isSelected')({ id: 1 }), true);
  assert.equal(subject.get('isSelected')({ id: 2 }), false);

  subject.set('value', [ { id: false } ])

  assert.equal(subject.get('isSelected')({ id: false }), true);
  assert.equal(subject.get('isSelected')({ id: true }), false);
});

test('@select', function(assert) {
  let subject = Ember.run(this, 'subject');

  Ember.run(subject, subject.setProperties, {
    value: null,
    key: 'id',
    from: [
      {
        id: 1,
        name: 'Link'
      },
      {
        id: 2,
        name: 'Zelda'
      }
    ]
  });

  subject.send('select', { id: 1 });

  assert.deepEqual(subject.get('value'), { id: 1 });

  Ember.run(subject, subject.setProperties, {
    value: [],
    key: 'id',
    from: [
      {
        id: 1,
        name: 'Link'
      },
      {
        id: 2,
        name: 'Zelda'
      }
    ]
  });

  subject.send('select', { id: 1 });

  assert.deepEqual(subject.get('value'), [ { id: 1 } ]);

  subject.send('select', { id: 1 });

  assert.deepEqual(subject.get('value'), [ { id: 1 } ]);

  subject.send('select', { id: 2 });

  assert.deepEqual(subject.get('value'), [ { id: 1 }, { id: 2 } ]);
});

test('@unselect', function(assert) {
  let subject = Ember.run(this, 'subject');

  Ember.run(subject, subject.setProperties, {
    value: { id: 1 },
    key: 'id',
    from: Object.freeze([
      {
        id: 1,
        name: 'Link'
      },
      {
        id: 2,
        name: 'Zelda'
      }
    ])
  });

  assert.deepEqual(subject.get('value'), { id: 1 });

  subject.send('unselect', { id: 1 });

  assert.deepEqual(subject.get('value'), null);

  Ember.run(subject, subject.setProperties, {
    value: [ { id: 1 } ],
    key: 'id',
    from: Object.freeze([
      {
        id: 1,
        name: 'Link'
      },
      {
        id: 2,
        name: 'Zelda'
      }
    ])
  });

  subject.send('unselect', { id: 1 });

  assert.deepEqual(subject.get('value'), []);

  Ember.run(subject, subject.setProperties, {
    value: { id: 1 },
    key: 'id',
    from: Object.freeze([
      {
        id: 1,
        name: 'Link'
      },
      {
        id: 2,
        name: 'Zelda'
      }
    ])
  });

  assert.deepEqual(subject.get('value'), { id: 1 });

  subject.send('unselect', { id: 1 });

  assert.deepEqual(subject.get('value'), null);

  Ember.run(subject, subject.setProperties, {
    value: [ { id: 1 }, { id: 2 } ],
    key: 'id',
    from: Object.freeze([
      {
        id: 1,
        name: 'Link'
      },
      {
        id: 2,
        name: 'Zelda'
      }
    ])
  });

  subject.send('unselect', { id: 1 });

  assert.deepEqual(subject.get('value'), [ { id: 2 } ]);

  subject.send('unselect', { id: 1 });

  assert.deepEqual(subject.get('value'), [ { id: 2 } ]);

  subject.send('unselect', { id: 2 });

  assert.deepEqual(subject.get('value'), []);
});
