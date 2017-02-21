/* jshint node:true */
var execSync = require('child_process').execSync;
//var RSVP = require('rsvp');

// For details on each option run `ember help release`
module.exports = {
  // local: true,
  // remote: 'some_remote',
  // annotation: "Release %@",
  // message: "Bumped version to %@",
  manifest: [ 'package.json', 'bower.json', 'yuidoc.json' ],
  // strategy: 'date',
  // format: 'YYYY-MM-DD',
  // timezone: 'America/Los_Angeles',

  beforeCommit: function(project, versions) {
    execSync('ember ember-cli-yuidoc', { encoding: 'utf8' });
    execSync('git add docs', { encoding: 'utf8' });
    execSync(`git commit -m "Release ${versions.next} docs"`, { encoding: 'utf8' });
  }
};
