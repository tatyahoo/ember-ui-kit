/* jshint node: true */
'use strict';

var Merge = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

var path = require('path');

module.exports = {
  name: 'ember-ui-kit',

  files: [
    'element-resize-detector/dist/element-resize-detector.js',
    'jquery-ui/ui/data.js',
    'jquery-ui/ui/version.js',
    'jquery-ui/ui/ie.js',
    'jquery-ui/ui/scroll-parent.js',
    'jquery-ui/ui/disable-selection.js',
    'jquery-ui/ui/plugin.js',
    'jquery-ui/ui/widget.js',
    'jquery-ui/ui/widgets/mouse.js',
    'jquery-ui/themes/base/sortable.css',
    'jquery-ui/ui/widgets/sortable.js',
    'jquery-ui/themes/base/resizable.css',
    'jquery-ui/ui/widgets/resizable.js'
  ],

  treeForVendor: function() {
    return new Merge([
      this.treeForNodeModule('jquery-ui'),
      this.treeForNodeModule('element-resize-detector')
    ]);
  },

  treeForNodeModule: function(module) {
    var fullPath = require.resolve(module);
    var ui = path.join(fullPath.substring(0, fullPath.indexOf(module)), module);

    return new Funnel(ui, {
      destDir: module
    });
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    var addon = this;

    this.files
      .map(function(file) {
        return path.join('vendor/', file);
      })
      .forEach(function(path) {
        addon.import(path);
      });
  }
};
