/* jshint node: true */
'use strict';

var Merge = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

var path = require('path');

module.exports = {
  name: 'ember-ui-kit',

  files: [
    // from `node_modules/`
    'element-resize-detector/dist/element-resize-detector.js',
    'jquery-ui/ui/data.js',
    'jquery-ui/ui/version.js',
    'jquery-ui/ui/position.js',
    'jquery-ui/ui/ie.js',
    'jquery-ui/ui/scroll-parent.js',
    'jquery-ui/ui/disable-selection.js',
    'jquery-ui/ui/plugin.js',
    'jquery-ui/ui/widget.js',
    'jquery-ui/ui/widgets/mouse.js',
    'jquery-ui/themes/base/sortable.css',
    'jquery-ui/ui/widgets/sortable.js',
    'jquery-ui/themes/base/resizable.css',
    'jquery-ui/ui/widgets/resizable.js',
    'jquery-ui/themes/base/draggable.css',
    'jquery-ui/ui/widgets/draggable.js',
    'jquery-ui/ui/safe-active-element.js',
    'jquery-ui/ui/safe-blur.js',
    'perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js',
    'perfect-scrollbar/dist/css/perfect-scrollbar.css',

    'jquery-ui-touch-punch/jquery.ui.touch-punch.js',

    'perfect-scrollbar/dist/css/perfect-scrollbar.css',
    'perfect-scrollbar/dist/js/perfect-scrollbar.jquery.js',

    // from `vendor/`
    //'ember-ui-kit/ui-table.css',
    //'ember-ui-kit/ui-scrollable.css',
    //'ember-ui-kit/ui-backdrop.css',
    //'ember-ui-kit/ui-position.css'
  ],

  treeForVendor: function(tree) {
    return new Merge([
      tree,
      this.treeForNodeModule('jquery-ui'),
      this.treeForNodeModule('perfect-scrollbar'),
      this.treeForNodeModule('jquery-ui-touch-punch'),
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
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'property-component',
      plugin: require('./lib/contextual-component-path-transform'),
      baseDir: function() {
        return __dirname;
      }
    });
  }
};
