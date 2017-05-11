import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('ui-table');
  this.route('ui-resizable');
  this.route('ui-draggable');
  this.route('ui-select');
  this.route('ui-scrollable');
  this.route('ui-position');
  this.route('fm-form');
});

export default Router;
