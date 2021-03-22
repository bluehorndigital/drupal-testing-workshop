# Drupal & Nightwatch.js training

Example of using Drupal's Nightwatch.js test suite

## TODO

* Write up how to do this locally
* DDEV Nightwatch won't connect to Chromedriver, due to sockets? PHPUnit OK
* Lando complains `private/browsertest_output` is not writeable, it should be generated on install but is missing

## Locally

Locally using

* [PHP Built-in server](https://www.php.net/manual/en/features.commandline.webserver.php)
* [SQLite](https://sqlite.org/index.html)
* [Chromedriver](https://chromedriver.chromium.org/)

https://mglaman.dev/blog/my-phpunit-configuration-my-drupal-projects

## DDEV

When working with DDEV, we just add a new service definition inside of `.ddev`

We add DrupalCI's chromedriver image as a service and configure the required
environment variables. This way we don't need to manipulate any configuration
that could be replaced if we upgrade Drupal core.

In `.ddev/docker-compose.testing.yaml`

```
---
# Adds Chromedriver and Drupal PHPUnit test environment variables for running tests.
version: '3.6'
services:
  chromedriver:
    image: drupalci/chromedriver:production
    container_name: ddev-${DDEV_SITENAME}-chromedriver
    labels:
      com.ddev.site-name: ${DDEV_SITENAME}
      com.ddev.approot: $DDEV_APPROOT

  web:
    links:
      - chromedriver:$DDEV_HOSTNAME
    environment:
      # PHPUnit
      SYMFONY_DEPRECATIONS_HELPER: weak
      SIMPLETEST_DB: mysql://db:db@db:3306/db
      SIMPLETEST_BASE_URL: http://web
      BROWSERTEST_OUTPUT_DIRECTORY: /var/www/html/private/browsertest_output
      BROWSERTEST_OUTPUT_BASE_URL: $DDEV_PRIMARY_URL
      MINK_DRIVER_ARGS_WEBDRIVER: '["chrome", {"browserName":"chrome","chromeOptions":{"args":["--disable-gpu","--headless", "--no-sandbox"]}}, "http://chromedriver:9515"]'

      # Nightwatch
      DRUPAL_TEST_BASE_URL: http://web
      DRUPAL_TEST_DB_URL: mysql://db:db@db:3306/db
      DRUPAL_TEST_WEBDRIVER_HOSTNAME: chromedriver
      DRUPAL_TEST_WEBDRIVER_PORT: 9515
      DRUPAL_TEST_CHROMEDRIVER_AUTOSTART: 'true'
      DRUPAL_TEST_WEBDRIVER_CHROME_ARGS: "--disable-gpu --headless"
      DRUPAL_NIGHTWATCH_OUTPUT: reports/nightwatch
      DRUPAL_NIGHTWATCH_IGNORE_DIRECTORIES: node_modules,vendor,.*,sites/*/files,sites/*/private,sites/simpletest
```

There are also custom DDEV commands to run PHPUnit and Nightwatch.

```
ddev phpunit core/modules/action
ddev nightwatch --tag core
```

Blogs:

* [Running Drupal's PHPUnit test suites on DDEV](https://mglaman.dev/blog/running-drupals-phpunit-test-suites-ddev)
* [Running Drupal's FunctionalJavascript tests on DDEV](https://mglaman.dev/blog/running-drupals-functionaljavascript-tests-ddev)
* [Running Drupal's Nightwatch test suite on DDEV](https://mglaman.dev/blog/running-drupals-nightwatch-test-suite-ddev)

## Lando

When working with Lando, we add data to the `.lando.yml` manifest.

We add DrupalCI's chromedriver image as a service and configure the required
environment variables. This way we don't need to manipulate any configuration
that could be replaced if we upgrade Drupal core.

We add services override to the `appserver` service for PHPUnit environment variables

```
services:
  appserver:
    overrides:
      environment:
      # PHPUnit
      SYMFONY_DEPRECATIONS_HELPER: weak
      SIMPLETEST_DB: 'mysql://drupal9:drupal9@database:3306/drupal9'
      SIMPLETEST_BASE_URL: 'http://localhost'
      BROWSERTEST_OUTPUT_DIRECTORY: /var/www/html/private/browsertest_output
      BROWSERTEST_OUTPUT_BASE_URL: $DDEV_PRIMARY_URL
      MINK_DRIVER_ARGS_WEBDRIVER: '["chrome", {"browserName":"chrome","chromeOptions":{"args":["--disable-gpu","--headless", "--no-sandbox"]}}, "http://chromedriver:9515"]'
```

We attach a `node` service for running Nightwatch and provide environment variables

```
services:
  node:
    type: node:12
    overrides:
      environment:
        # Nightwatch
        DRUPAL_TEST_BASE_URL: 'http://appserver'
        DRUPAL_TEST_DB_URL: 'mysql://drupal9:drupal9@database:3306/drupal9'
        DRUPAL_TEST_WEBDRIVER_HOSTNAME: chromedriver
        DRUPAL_TEST_WEBDRIVER_PORT: 9515
        DRUPAL_TEST_CHROMEDRIVER_AUTOSTART: 'false'
        DRUPAL_TEST_WEBDRIVER_CHROME_ARGS: "--disable-gpu --headless"
        DRUPAL_NIGHTWATCH_OUTPUT: reports/nightwatch
        DRUPAL_NIGHTWATCH_IGNORE_DIRECTORIES: node_modules,vendor,.*,sites/*/files,sites/*/private,sites/simpletest
```

Finally, we add the chromedriver service.

```
services:
  chromedriver:
    type: compose
    services:
      image: drupalci/chromedriver:production
      # Lando overrides the default entrypoint.
      command: chromedriver --log-path=/tmp/chromedriver.log --verbose --whitelisted-ips=
```

Then, with tooling definitions, we can run the tests

```
lando phpunit core/modules/action
lando nightwatch --tag core
```
