import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('ui-position', 'Unit | Component | ui-position', {
  unit: true
});

test('it normalizes options', function(assert) {
  let component = this.subject();

  component.set('options', {
    my: 'left+10   ',
    at: '  bottom',
    of: true
  });

  assert.deepEqual(component.get('optionsNormalized'), {
    my: 'left+10',
    at: 'bottom',
    of: true
  });

  component.set('options', {
    my: '  left+10 top+25%  ',
    at: 'right bottom  ',
    of: true
  });

  assert.deepEqual(component.get('optionsNormalized'), {
    my: 'left+10 top+25%',
    at: 'right bottom',
    of: true
  });

  component.set('options', {
    my: 'top+10     right+25%',
    at: 'bottom       left',
    of: true
  });

  assert.deepEqual(component.get('optionsNormalized'), {
    my: 'right+25% top+10',
    at: 'left bottom',
    of: true
  });

  component.set('options', {
    my: 'center+10     right+25%',
    at: 'bottom       center',
    of: true
  });

  assert.deepEqual(component.get('optionsNormalized'), {
    my: 'right+25% center+10',
    at: 'center bottom',
    of: true
  });

  component.set('options', {
    my: 'center+10     center+25%',
    at: 'center       center',
    of: true
  });

  assert.deepEqual(component.get('optionsNormalized'), {
    my: 'center+10 center+25%',
    at: 'center center',
    of: true
  });
});
