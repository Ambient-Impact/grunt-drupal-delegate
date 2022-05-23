'use strict';

module.exports = function(grunt) {

  const childProcess = require('child_process');

  const shescape = require('shescape');

  require('./lib/recursion_check')(grunt);

  require('./lib/drush_check')(grunt);

  require('./lib/drupal_extension_tasks')(grunt);

};
