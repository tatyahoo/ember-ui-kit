import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  author: belongsTo('user'),
  tags: hasMany('tag'),
  comments: hasMany('comments')
});
