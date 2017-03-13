import { swapNodes, getBox, layout } from 'ember-ui-kit/utils/dom';
import { module, test } from 'qunit';

import Ember from 'ember';

module('Unit | Utility | dom', {
  beforeEach() {
    this.canvas = Ember.$('#ember-testing');
  },

  afterEach() {
    this.canvas.empty();
  }
});

test('#swapNodes', function(assert) {
  let nodes = this.canvas.append(`
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
    </ul>
  `);
  let [ first, second, third, fourth ] = nodes.find('li').toArray().map(Ember.$);

  assert.equal(nodes.find('li').eq(0).text(), 'Item 1', 'should init correct: 1');
  assert.equal(nodes.find('li').eq(1).text(), 'Item 2', 'should init correct: 2');
  assert.equal(nodes.find('li').eq(2).text(), 'Item 3', 'should init correct: 3');
  assert.equal(nodes.find('li').eq(3).text(), 'Item 4', 'should init correct: 4');

  swapNodes(first, third);

  assert.equal(nodes.find('li').eq(0).text(), 'Item 3', 'should swap first and third correct: 1');
  assert.equal(nodes.find('li').eq(1).text(), 'Item 2', 'should swap first and third correct: 2');
  assert.equal(nodes.find('li').eq(2).text(), 'Item 1', 'should swap first and third correct: 3');
  assert.equal(nodes.find('li').eq(3).text(), 'Item 4', 'should swap first and third correct: 4');

  swapNodes(second, fourth);

  assert.equal(nodes.find('li').eq(0).text(), 'Item 3', 'should second and fourth correct: 1');
  assert.equal(nodes.find('li').eq(1).text(), 'Item 4', 'should second and fourth correct: 2');
  assert.equal(nodes.find('li').eq(2).text(), 'Item 1', 'should second and fourth correct: 3');
  assert.equal(nodes.find('li').eq(3).text(), 'Item 2', 'should second and fourth correct: 4');

  swapNodes(second, third);

  assert.equal(nodes.find('li').eq(0).text(), 'Item 2', 'should second and fourth correct: 1');
  assert.equal(nodes.find('li').eq(1).text(), 'Item 4', 'should second and fourth correct: 2');
  assert.equal(nodes.find('li').eq(2).text(), 'Item 1', 'should second and fourth correct: 3');
  assert.equal(nodes.find('li').eq(3).text(), 'Item 3', 'should second and fourth correct: 4');
});

test('#getBox', function(assert) {
  let node = this.canvas.append(`
    <style>
      .outer {
        width: 320px;
        height: 240px;
        background: black;
      }

      .inner {
        width: 50%;
        height: 50%;
        margin: 25% 0 50% auto;
        padding: 5% 10% 15% 20%;
        border: 5px solid transparent;
        display: inline-block;
        background: yellow;
      }
    </style>

    <div class="outer">
      <div class="inner">
        TEXT
      </div>
    </div>
  `);

  let box = getBox(node.find('.inner'));

  assert.deepEqual(box, {
    width: 160,
    height: 120,
    scrollWidth: 256,
    scrollHeight: 184,

    margin: {
      top: 80,
      right: 0,
      bottom: 160,
      left: 0
    },

    padding: {
      top: 16,
      right: 32,
      bottom: 48,
      left: 64
    },

    border: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    }
  });
});

test('#layout', function(assert) {
  assert.deepEqual(layout(300, [ '45px', '10%', '15%', '1fr', '2fr' ]), [ 45, 30, 45, 60, 120 ]);
  assert.deepEqual(layout(300, [ '45px', null, '15%', '1fr', null ]), [ 45, null, 45, 210, null ]);
});
