import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  subtitle: DS.attr('string'),
  content: DS.attr('string'),

  author: DS.belongsTo('user'),
  tags: DS.hasMany('tag'),
  comments: DS.hasMany('comment')
});
