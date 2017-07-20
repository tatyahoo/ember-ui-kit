import { sendEventAction } from 'ember-ui-kit/utils/ddau';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Utility | ddau');

test('#sendEventAction', function(assert) {
  let fn = sinon.stub();
  let action = 'action';
  let context = {
    set: sinon.spy(),
    get: sinon.stub().returns(fn),
    sendAction: sinon.spy()
  };

  sendEventAction(context, 'action', 'value', 1);

  assert.ok(context.get.calledWith('action'));
  assert.ok(fn.called);
  assert.ok(context.set.called);
  assert.notOk(context.sendAction.called);

  fn.reset();
  context.get.reset();
  context.set.reset();
  context.sendAction.reset();

  context.get.returns(action);

  sendEventAction(context, 'action', 'value', 1);

  assert.notOk(fn.called);
  assert.notOk(context.set.called);
  assert.ok(context.get.calledWith('action'));
  assert.notOk(context.set.called);
  assert.ok(context.sendAction.calledWith('action', 1));

  fn.reset();
  context.get.reset();
  context.set.reset();
  context.sendAction.reset();

  fn.returns(2);
  context.get.returns(fn);

  sendEventAction(context, 'action', 'value', 1);

  assert.ok(fn.called);
  assert.ok(context.set.called);
  assert.ok(context.get.calledWith('action'));
  assert.ok(context.set.calledWith('value', 2));
  assert.notOk(context.sendAction.called);
});
