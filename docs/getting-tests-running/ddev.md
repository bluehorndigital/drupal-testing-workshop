---
layout: default
title: DDEV
parent: Getting tests running
nav_order: 3
---

# DDEV

When working with DDEV, we just add a new service definition inside of `.ddev`

We add DrupalCI's chromedriver image as a service and configure the required
environment variables. This way we don't need to manipulate any configuration
that could be replaced if we upgrade Drupal core.

In `.ddev/docker-compose.testing.yaml`

See https://ddev.readthedocs.io/en/stable/users/extend/custom-compose-files/

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
      DRUPAL_TEST_CHROMEDRIVER_AUTOSTART: 'false'
      DRUPAL_TEST_WEBDRIVER_CHROME_ARGS: "--disable-gpu --headless"
      DRUPAL_NIGHTWATCH_OUTPUT: reports/nightwatch
      DRUPAL_NIGHTWATCH_IGNORE_DIRECTORIES: node_modules,vendor,.*,sites/*/files,sites/*/private,sites/simpletest
```

## Custom commands

You can also provide custom DDEV commands to make running the tests easier: https://ddev.readthedocs.io/en/stable/users/extend/custom-commands/

PHPUnit: `.ddev/commands/web/phpunit`

```
#!/bin/bash

## Description: Run PHPUnit
## Usage: phpunit [flags] [args]
## Example: "ddev phpunit --group big_pipe" or "ddev phpunit core/modules/action"

cd web
php ../vendor/bin/phpunit -c core/phpunit.xml.dist $@
```

Nightwatch: `.ddev/commands/web/nightwatch`

```
#!/bin/bash

## Description: Run Nightwatch
## Usage: nightwatch [flags] [args]
## Example: "ddev nightwatch" or "ddev nightwatch --tag core"

yarn --cwd /var/www/html/web/core test:nightwatch $@
```
