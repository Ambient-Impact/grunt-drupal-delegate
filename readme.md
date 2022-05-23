Grunt plug-in to run Grunt tasks defined in Drupal extensions from the Drupal
root.

This is inspired by
[`grunt-shell`](https://github.com/sindresorhus/grunt-shell), which is
recommended for more general-purpose shell execution.

----

# Requirements

* A working [Drupal](https://www.drupal.org/) installation

* [Drush](https://www.drush.org/) 9 or newer

* [Grunt](https://gruntjs.com/) 1.5 or newer

* [Node.js](https://nodejs.org/) 14 or newer

----

# Planned improvements

* Caching of Drupal extension names and their local paths so that Drush does not need to be invoked every time. Ideally this would be stored in a temporary file that's only rebuilt when the Drupal cache is rebuilt and/or extensions enabled/disabled.

* Options to enable or disable output like [`grunt-shell`](https://github.com/sindresorhus/grunt-shell#options) has.

----

# Credits

* [semver](https://www.npmjs.com/package/semver) is used to compare semantic version strings for Drush detection.

* [Shescape](https://www.npmjs.com/package/shescape) is used to escape shell characters in the delegated commands to prevent arbitrary shell execution. Recommended that you use it in your own projects whenever executing shell commands containing user input.
