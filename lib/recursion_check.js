'use strict';

module.exports = function(grunt) {

  const process = require('process');

  /**
   * Environment variable name used to prevent recursion.
   *
   * @type {String}
   */
  const bubbleEnvName = 'gruntDrushDelegateBubble';

  /**
   * Whether the current process has bubbled up the directory tree.
   *
   * Grunt's default behaviour if it doesn't find a gruntfile in the specified
   * directory is to go up the directory tree one by one and run the first one
   * it finds. Unfortunately, this means that if no gruntfile is found at any
   * level, it can eventually get to a gruntfile in your project root which can
   * cause recursion of this task and result in confusing errors.
   *
   * This determines if our environment variable exists in the current Node.js
   * process. Since any changes to environment variables do not persist outside
   * of this process unless explicitly passed on to child processes, we can use
   * the presence of the variable to infer that Grunt has likely invoked us a
   * second time:
   *
   * 1. Project root call to this plug-in, no environment variable set yet.
   *
   * 2. Plug-in attempts to invoke Grunt on a specified Drupal extension,
   *    setting the environment variable for the child process.
   *
   * 3. Grunt finds that the Drupal extension does not contain a gruntfile, and
   *    checks each directory up the tree, until it finds the one in the project
   *    root and uses that. Environment variable is now found.
   *
   * @type {Boolean}
   */
  const isBubbled = (bubbleEnvName in process.env);

  if (isBubbled) {

    // Fail with a fatal error if fetching the Drush version resulted in an
    // error.
    //
    // @see https://gruntjs.com/exit-codes
    grunt.fail.fatal(
      `The specified Drupal extension does not appear to have a gruntfile.`, 1
    );

  }

  // Set our bubble variable to the environment variables provided to the
  // grunt-shell task. Note that this won't persist outside of the Node.js
  // process so it'll only be set here and in the grunt-shell task (because we
  // pass it to the task) so we can rely on it not existing.
  process.env[bubbleEnvName] = true;

};
