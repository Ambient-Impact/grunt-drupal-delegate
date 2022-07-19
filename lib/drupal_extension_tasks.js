'use strict';

module.exports = function(grunt) {

  const childProcess = require('child_process');

  const shescape = require('shescape');

  const process = require('process');

  /**
   * Tasks to delegate to one or more Drupal extensions.
   *
   * The top-level keys are Drupal extension machine names, each containing an
   * object with the following keys:
   *
   * - 'path': String absolute filesystem path to the extension's directory.
   *
   * - 'tasks': Array of one or more task strings to invoke on the Drupal
   *   extension.
   *
   * @type {Object}
   */
  let delegatedTasks = {};

  for (let i = 0; i < grunt.cli.tasks.length; i++) {

    /**
     * An array of task strings split by the ':' character.
     *
     * @type {String[]}
     */
    let taskSplit = shescape.escapeAll(grunt.cli.tasks[i].split(':'));

    /**
     * A string that might be a Drupal extension name.
     *
     * Note that this is intentionally only escaped and not quoted at this stage
     * as quoting would break things when this is used as a property name and
     * result in Grunt not finding the task.
     *
     * @type {String}
     */
    const possibleExtensionName = taskSplit[0];

    // If a Grunt task already exists with this name, do nothing.
    //
    // @todo Make this an option?
    if (grunt.task.exists(possibleExtensionName)) {
      continue;
    }

    try {

      // If the extension key doesn't exist in delegatedTasks yet, create it.
      if (!(possibleExtensionName in delegatedTasks)) {

        // Attempt to get the extension path from Drush.
        //
        // @see https://stackoverflow.com/questions/25340875/nodejs-child-process-exec-disable-printing-of-stdout-on-console/45578119#45578119
        //   How to prevent outputting errors and only capture them.
        const possibleExtensionPath = childProcess.execSync(
          `drush drupal:directory ${shescape.quote(possibleExtensionName)}`,
          {stdio: 'pipe'}
        ).toString().trim();

        delegatedTasks[possibleExtensionName] = {
          path:   possibleExtensionPath,
          tasks:  []
        };

      }

      // Add the task array without the Drupal extension name.
      delegatedTasks[possibleExtensionName].tasks[i] = taskSplit.slice(1);

    } catch (error) {

      // Fail with a task error code if neither a task with the specified name
      // nor a Drupal extension of that name exist.
      //
      // @see https://gruntjs.com/exit-codes
      grunt.fail.fatal(
        `No task or Drupal extension found for "${possibleExtensionName}"`, 3
      );
    }

  }

  /**
   * Capture and pipe child process output to the parent process.
   *
   * @param {Stream} child
   *   The child Stream instance.
   *
   * @param {Stream} output
   *   The parent Stream instance.
   */
  const captureOutput = function(child, output) {
    child.pipe(output);
  };

  for (const extensionName in delegatedTasks) {

    if (!delegatedTasks.hasOwnProperty(extensionName)) {
      continue;
    }

    /**
     * The current Drupal extension object.
     *
     * @type {Object}
     */
    const extension = delegatedTasks[extensionName];

    for (let i = 0; i < extension.tasks.length; i++) {

      // Register a Grunt task with the requested delegated task.
      grunt.registerTask(
        `${extensionName}:${extension.tasks[i].join(':')}`,
        `Delegated task for the '${extensionName}' Drupal extension.`,
      function(gruntCommand) {

        /**
         * Asynchronous method reference to be called in child process callback.
         *
         * @type {Function}
         *
         * @see https://gruntjs.com/api/inside-tasks#this.async
         */
        const asyncMe = this.async();

        /**
         * The Node.js child process instance for this delegated Grunt task.
         *
         * @type {ChildProcess}
         */
        const gruntProcess = childProcess.exec(
          `grunt ${shescape.quote(extension.tasks[i].join(':'))}`,
          {
            cwd: extension.path,
            // Pass environment variables to the child process so that recursion
            // detection works.
            env: process.env
          },
          function(error, stdout, stderr) {

            if (error) {
              grunt.warn(error);
            }

            asyncMe();

          }
        );

        // Pipe child process stdout and stderr to the current process.
        captureOutput(gruntProcess.stdout, process.stdout);
        captureOutput(gruntProcess.stderr, process.stderr);

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.pipe(gruntProcess.stdin);

      });

    }

  }

};
