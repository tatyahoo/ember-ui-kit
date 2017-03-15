import Ember from 'ember';

import Composable from '../mixins/composable';

/**
 * `{{fm-form}}` component wraps a `DS.Model` object and yields
 * `{{fm-field}}` with appropriate validations setup. Each `{{fm-field}}`
 * yields more contextual input component to let you choose how to
 * represent the field.
 *
 * `{{fm-field}}` can be interlaced with HTML tags to provide additional
 * layout needs.
 *
 * Basic Usage:
 *
 * ```handlebars
 * {{#fm-form model as |attribute|}}
 *   {{#attribute.name as |in|}}
 *     {{in.text}}
 *   {{/attribute.name}}
 *   {{#attribute.address as |in|}}
 *     {{in.text}}
 *   {{/attribute.address}}
 * {{/fm-form}}
 * ```
 *
 * `{{fm-form}}` integrates with `{{ui-table}}` to allow editability
 * and validability.
 *
 * Advanced Usage:
 *
 * ```handlebars
 * {{#ui-table as |t|}}
 *   {{#t.body as |t|}}
 *     {{#each data as |datum|}}
 *       {{#t.r as |t|}}
 *         {{#fm-form datum as |attribute|}}
 *           {{#t.d}}
 *             {{#attribute.name as |in|}}
 *               {{in.text}}
 *             {{/attribute.name}}
 *           {{/t.d}}
 *           {{#t.d}}
 *             {{#attribute.age as |in|}}
 *               {{in.text}}
 *             {{/attribute.age}}
 *           {{/t.d}}
 *         {{/fm-form}}
 *       {{/t.r}}
 *     {{/each}}
 *   {{/t.body}}
 * {{/ui-table}}
 * ```
 *
 * @public
 * @module form
 * @class fm-form
 */
export default Ember.Component.extend(Composable, {
  tagName: 'form',
  classNames: 'fm-form',

  /**
   * @attribute model The model to use for property binding.
   */
  model: Ember.computed({
    get() {
      Ember.assert('fm-form#model must be set');
    },

    set(key, value) {
      Ember.assert('fm-form#model must represent a single object', !Ember.isArray(value));

      return value;
    }
  }),

}).reopenClass({
  positionalParams: ['model']
});
