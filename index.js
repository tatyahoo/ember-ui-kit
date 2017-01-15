/* jshint node: true */
'use strict';

var Merge = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

var path = require('path');

module.exports = {
  name: 'ember-ui-kit',

  files: [
    'ui/data.js',
    'ui/version.js',
    'ui/ie.js',
    'ui/scroll-parent.js',
    'ui/widget.js',
    'ui/widgets/mouse.js',
    'ui/widgets/sortable.js'
  ],

  treeForVendor: function() {
    var module = 'jquery-ui';
    var fullPath = require.resolve(module);
    var ui = path.join(fullPath.substring(0, fullPath.indexOf('jquery-ui')), 'jquery-ui');

    return new Funnel(ui, {
      destDir: 'jquery-ui'
    });
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    var addon = this;

    this.files
      .map(function(file) {
        return path.join('vendor/jquery-ui', file);
      })
      .forEach(function(path) {
        addon.import(path);
      });
  }
};
