---
layout: default
title: Lando
parent: Getting tests running
nav_order: 4
---

# Lando

When working with Lando, we add data to the `.lando.yml` manifest.

We add DrupalCI's chromedriver image as a service and configure the required
environment variables. This way we don't need to manipulate any configuration
that could be replaced if we upgrade Drupal core.

We add services override to the `appserver` service for PHPUnit environment variables and to install Node. Even though Nightwatch is a JavaScript end to end testing framework, it executes
PHP scripts to setup the test site.

```
services:
  appserver:
    build_as_root:
      # Note that you will want to use the script for the major version of node you want to install
      # See: https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
      - curl -sL https://deb.nodesource.com/setup_12.x | bash -
      - apt-get install -y nodejs
      - npm install --global yarn
    build:
      - composer install
      - mkdir -p private/browsertest_output
      - yarn install --non-interactive --cwd /app/web/core
    overrides:
      environment:
        # PHPUnit
        SYMFONY_DEPRECATIONS_HELPER: weak
        SIMPLETEST_DB: 'mysql://drupal9:drupal9@database:3306/drupal9'
        SIMPLETEST_BASE_URL: 'http://appserver'
        BROWSERTEST_OUTPUT_DIRECTORY: /var/www/html/private/browsertest_output
        # @todo is there a way to dynamically set this in .lando.yml?
        # like have this read from $LANDO_DOMAIN
        BROWSERTEST_OUTPUT_BASE_URL: https://nightwatch-training.lndo.site/
        MINK_DRIVER_ARGS_WEBDRIVER: '["chrome", {"browserName":"chrome","chromeOptions":{"args":["--disable-gpu","--headless", "--no-sandbox"]}}, "http://chromedriver:9515"]'

        # Nightwatch
        DRUPAL_TEST_BASE_URL: 'http://appserver'
        DRUPAL_TEST_DB_URL: 'mysql://drupal9:drupal9@database:3306/drupal9'
        DRUPAL_TEST_WEBDRIVER_HOSTNAME: chromedriver
        DRUPAL_TEST_WEBDRIVER_PORT: 9515
        DRUPAL_TEST_CHROMEDRIVER_AUTOSTART: 'false'
        DRUPAL_TEST_WEBDRIVER_CHROME_ARGS: "--disable-gpu --headless --no-sandbox"
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
