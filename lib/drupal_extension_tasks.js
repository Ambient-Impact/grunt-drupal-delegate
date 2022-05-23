'use strict';

module.exports = function(grunt) {

  const childProcess = require('child_process');

  const shescape = require('shescape');

  const process = require('process');

  let delegatedTasks = {};

  for (let i = 0; i < grunt.cli.tasks.length; i++) {

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
    if (grunt.task.exists(possibleExtensionName)) {
      continue;
    }

    try {

      if (!(possibleExtensionName in delegatedTasks)) {

        // Attempt to get the extension path from Drush.
        //
        // @see https://stackoverflow.com/questions/25340875/nodejs-child-process-exec-disable-printing-of-stdout-on-console/45578119#45578119
        //   How to prevent outputting errors from the child process.
        const possibleExtensionPath = childProcess.execSync(
          `drush drupal:directory ${shescape.quote(possibleExtensionName)}`,
          {stdio: 'pipe'}
        ).toString().trim();

        delegatedTasks[possibleExtensionName] = {
          path:   possibleExtensionPath,
          tasks:  []
        };

      }

      delegatedTasks[possibleExtensionName].tasks[i] = taskSplit.slice(1);

    } catch (error) {

      // @see https://gruntjs.com/exit-codes
      grunt.fail.fatal(
        `No task or Drupal extension found for "${possibleExtensionName}"`, 3
      );
    }

  }

  const captureOutput = function(child, output) {
    child.pipe(output);
  };

  for (const extensionName in delegatedTasks) {

    if (!delegatedTasks.hasOwnProperty(extensionName)) {
      continue;
    }

    const extension = delegatedTasks[extensionName];

    for (let i = 0; i < extension.tasks.length; i++) {

      grunt.registerTask(
        `${extensionName}:${extension.tasks[i].join(':')}`,
        `Delegated task for the '${extensionName}' Drupal extension.`,
      function(gruntCommand) {

        const callback = this.async();

        const gruntProcess = childProcess.exec(
          `grunt ${extension.tasks[i].join(':')}`,
          {
            cwd: extension.path,
            env: process.env
          },
          function(error, stdout, stderr) {

            if (error) {
              grunt.warn(error);
            }

            callback();

          }
        );

        captureOutput(gruntProcess.stdout, process.stdout);
        captureOutput(gruntProcess.stderr, process.stderr);

        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.pipe(gruntProcess.stdin);

      });

    }

  }

};
