import DS from 'ember-data';

export default DS.Model.extend({
  content: DS.attr('string'),

  author: DS.belongsTo('user'),
  post: DS.belongsTo('post')
});
