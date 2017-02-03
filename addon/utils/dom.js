import Ember from 'ember';

const PLACEHOLDER = Ember.$(document.createTextNode(''));

export function swapNodes(...args) {
  let [ left, right ] = args.map(Ember.$);

  PLACEHOLDER.insertBefore(left);

  left.insertBefore(right);
  right.insertAfter(PLACEHOLDER);

  PLACEHOLDER.remove();
}

function prepareSheet(node) {
  let style = node.children().first();

  if (!style.is('style')) {
    style = node.prepend('<style>').children().first();
  }

  return style.prop('sheet');
}

function prepareRule(sheet, selector) {
  let rule = Array.from(sheet.rules).reverse().find(rule => {
    return rule.selectorText === selector;
  });

  if (rule) {
    return rule;
  }

  sheet.insertRule(`${selector} {}`, sheet.rules.length);

  return prepareRule(sheet, selector);
}

export function styleable(...args) {
  let fn = args.pop();
  let keys = args;

  function styleOnce() {
    let context = this;
    let applyThis = fn.call(context);

    if (!applyThis) {
      return;
    }

    let sheet = prepareSheet(this.$());

    Object.keys(applyThis).forEach(key => {
      let rule = prepareRule(sheet, key);
      let properties = applyThis[key];

      Object.keys(properties).forEach(key => {
        let value = properties[key];

        if (typeof value === 'function') {
          value = value.call(context);
        }

        rule.style.setProperty(key, value);
      });
    });
  }

  return Ember.observer(...keys, function() {
    Ember.run.scheduleOnce('afterRender', this, styleOnce);
  });
}
