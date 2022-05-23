'use strict';

module.exports = function(grunt) {

  const childProcess = require('child_process');

  try {

    childProcess.execSync('drush --version', {stdio: 'pipe'});

  } catch (error) {

    // @see https://gruntjs.com/exit-codes
    grunt.fail.fatal(
      `Drush does not appear to be available! Got error:\n${error.message}`, 1
    );

  }

};
