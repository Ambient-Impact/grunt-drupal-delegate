'use strict';

module.exports = function(grunt) {

  require('./lib/recursion_check')(grunt);

  require('./lib/drush_check')(grunt);

  require('./lib/drupal_extension_tasks')(grunt);

};
