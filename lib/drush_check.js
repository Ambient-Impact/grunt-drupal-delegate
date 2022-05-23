'use strict';

module.exports = function(grunt) {

  const childProcess = require('child_process');

  const semver = require('semver');

  try {

    /**
     * The Drush version as a semantic version string.
     *
     * @type {String}
     *
     * @see https://stackoverflow.com/questions/25340875/nodejs-child-process-exec-disable-printing-of-stdout-on-console/45578119#45578119
     *   How to prevent outputting errors and only capture them.
     */
    const drushVersion = childProcess.execSync(
      'drush version --format=string', {stdio: 'pipe'}
    ).toString().trim();

    if (semver.lt(drushVersion, '9.0.0')) {

      // Fail with a fatal error if a version of Drush older than 9.0.0 is
      // found.
      //
      // @see https://gruntjs.com/exit-codes
      grunt.fail.fatal(
        `Drush 9.0.0 or newer is required. Found Drush ${drushVersion}`, 1
      );

    }

    grunt.verbose.writeln(`Found Drush ${drushVersion}; proceeding.`);

  } catch (error) {

    // Fail with a fatal error if fetching the Drush version resulted in an
    // error.
    //
    // @see https://gruntjs.com/exit-codes
    grunt.fail.fatal(
      `Tried to detect Drush version but got error:\n${error.message}`, 1
    );

  }

};
