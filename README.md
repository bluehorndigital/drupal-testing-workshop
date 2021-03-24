# Drupal & Nightwatch.js training

[![Lando](https://github.com/bluehorndigital/drupal-testing-workshop/actions/workflows/lando.yml/badge.svg)](https://github.com/bluehorndigital/drupal-testing-workshop/actions/workflows/lando.yml) [![DDEV](https://github.com/bluehorndigital/drupal-testing-workshop/actions/workflows/ddev.yml/badge.svg)](https://github.com/bluehorndigital/drupal-testing-workshop/actions/workflows/ddev.yml) [![Local](https://github.com/bluehorndigital/drupal-testing-workshop/actions/workflows/local.yml/badge.svg)](https://github.com/bluehorndigital/drupal-testing-workshop/actions/workflows/local.yml)

Example of using Drupal's Nightwatch.js test suite

## Notes

### Chromedriver `--no-sandbox` in containers

When running headless Chrome via Chromedriver in a container, you must specify
the `--no-sandbox` flag. Without this flag, Chrome will not start. This can be
mitigated if the container has an appropriate user configured (the DrupalCI image
used here does not&ast;)

Source: https://developers.google.com/web/updates/2017/04/headless-chrome

&ast; The example provided by Google shows an example from [Lighthouse Bot](https://github.com/GoogleChromeLabs/lighthousebot/blob/master/builder/Dockerfile#L35-L40) that sets the user to `chrome`. The `drupalci/chromedriver` performs nearly the same operation but as `chromeuser`. I have opened an issue for the DrupalCI image here: https://www.drupal.org/project/drupalci_environments/issues/3205271

## TODO

* Write up how to do this locally
* Lando complains `private/browsertest_output` is not writeable, it should be generated on install but is missing

## Locally

[Getting tests running: Locally](https://bluehorndigital.github.io/drupal-testing-workshop/getting-tests-running/locally.html)

Locally using

* [PHP Built-in server](https://www.php.net/manual/en/features.commandline.webserver.php)
* [SQLite](https://sqlite.org/index.html)
* [Chromedriver](https://chromedriver.chromium.org/)

https://mglaman.dev/blog/my-phpunit-configuration-my-drupal-projects

## DDEV

[Getting tests running: DDEV](https://bluehorndigital.github.io/drupal-testing-workshop/getting-tests-running/ddev.html)

There are DDEV commands to run PHPUnit and Nightwatch setup in this project.

```
ddev phpunit core/modules/action
ddev nightwatch --tag core
```

Blogs:

* [Running Drupal's PHPUnit test suites on DDEV](https://mglaman.dev/blog/running-drupals-phpunit-test-suites-ddev)
* [Running Drupal's FunctionalJavascript tests on DDEV](https://mglaman.dev/blog/running-drupals-functionaljavascript-tests-ddev)
* [Running Drupal's Nightwatch test suite on DDEV](https://mglaman.dev/blog/running-drupals-nightwatch-test-suite-ddev)

## Lando

[Getting tests running: Lando](https://bluehorndigital.github.io/drupal-testing-workshop/getting-tests-running/lando.html)

With tooling definitions preconfigured in this project, we can run the tests

```
lando phpunit core/modules/action
lando nightwatch --tag core
```
