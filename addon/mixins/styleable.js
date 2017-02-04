import Ember from 'ember';

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

export default Ember.Mixin.create({
  sheet: Ember.computed(function() {
    return Ember.$('<style>').appendTo(document.head).prop('sheet');
  }).readOnly(),

  style(selector, properties) {
    let sheet = this.get('sheet');
    let rule = prepareRule(sheet, selector);

    Object.keys(properties).forEach(key => {
      let value = properties[key];

      if (typeof value === 'function') {
        value = value.call(context);
      }

      rule.style.setProperty(key, value);
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    Ember.$(this.get('sheet.ownerNode')).remove();
  }
});
