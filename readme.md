Grunt plug-in to run Grunt tasks defined in Drupal extensions (modules, themes,
install profiles) from the Drupal root.

This is inspired by
[`grunt-shell`](https://github.com/sindresorhus/grunt-shell), which is
recommended for more general-purpose shell execution.

----

# Installation

```
npm install --save-dev grunt-drupal-delegate
```

Then, in your project root's gruntfile:

```javascript
require('grunt-drupal-delegate')(grunt);
```

And that's it - [any tasks](https://gruntjs.com/creating-tasks) defined in
Drupal extensions that Drush can find can now be invoked from the Drupal root.

----

# Usage

From your Drupal root directory, invoke `grunt drupal_extension:task`, where
`drupal_extension` is the machine name of the Drupal extesion you want to run
tasks for, with anything after the first `:` the name of a task or [multi
task](https://gruntjs.com/creating-tasks#multi-tasks) defined in that Drupal
extension's gruntfile.

## Examples

* `grunt my_module:sass` - Invoke the `sass` task defined in `my_module`'s gruntfile.

* `grunt my_theme:sass:header` - Invoke the `sass:header` multi task defined in `my_theme`'s gruntfile.

* `grunt my_module:sass my_theme:sass:header` - Do both of the above with a single command.

* `grunt my_module:sass my_theme:sass my_theme:uglify` - Also supports more than one task per Drupal extension.

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
