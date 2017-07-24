import Ember from 'ember';

const PLACEHOLDER = Ember.$(document.createTextNode(''));

export function swapNodes(...args) {
  let [ left, right ] = args.map(Ember.$);

  PLACEHOLDER.insertBefore(left);

  left.insertBefore(right);
  right.insertAfter(PLACEHOLDER);

  PLACEHOLDER.remove();
}

export function getBox(element) {
  if (!element) {
    return {
      width: 0,
      height: 0,

      scrollWidth: 0,
      scrollHeight: 0,

      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      border: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    };
  }

  if (element instanceof Ember.$) {
    element = element.get(0);
  }

  let css = getComputedStyle(element);

  return {
    width: parseFloat(css.getPropertyValue('width')),
    height: parseFloat(css.getPropertyValue('height')),

    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,

    margin: {
      top: parseFloat(css.getPropertyValue('margin-top')),
      right: parseFloat(css.getPropertyValue('margin-right')),
      bottom: parseFloat(css.getPropertyValue('margin-bottom')),
      left: parseFloat(css.getPropertyValue('margin-left'))
    },
    padding: {
      top: parseFloat(css.getPropertyValue('padding-top')),
      right: parseFloat(css.getPropertyValue('padding-right')),
      bottom: parseFloat(css.getPropertyValue('padding-bottom')),
      left: parseFloat(css.getPropertyValue('padding-left'))
    },
    border: {
      top: parseFloat(css.getPropertyValue('border-top-width')),
      right: parseFloat(css.getPropertyValue('border-right-width')),
      bottom: parseFloat(css.getPropertyValue('border-bottom-width')),
      left: parseFloat(css.getPropertyValue('border-left-width'))
    }
  };
}

export function layout(width, portions) {
  let fr = 0;
  let available = width;

  return portions
    .map(portion => {
      if (typeof portion === 'number') {
        return {
          value: portion,
          unit: 'px'
        };
      }
      else if (portion === null) {
        return {
          value: 0,
          unit: 'null'
        };
      }

      let expr = portion.match(/([\d.]+)(px|%|fr)/);

      Ember.assert(`Layout expression ${portion} not recognized`, expr);

      let [ , value, unit ] = expr;

      return {
        value: Number(value),
        unit
      };
    })
    .map(portion => {
      let { value, unit } = portion;

      if (unit === 'px') {
        available -= value;

        return value;
      }
      else if (unit === '%') {
        value = width * value / 100;

        available -= value;

        return value;
      }
      else if (unit === 'fr') {
        fr += value;

        return portion;
      }
      else if (unit === 'null') {
        return portion;
      }
      else {
        Ember.assert(`Unrecognized unit ${unit}`);
      }
    })
    .map(portion => {
      if (typeof portion === 'number') {
        return portion;
      }
      else if (portion.unit === 'fr') {
        return available * portion.value / fr;
      }
      else if (portion.unit === 'null') {
        return null;
      }
      else {
        Ember.assert(`Unrecognized unit ${portion.unit}`);
      }
    });
}
