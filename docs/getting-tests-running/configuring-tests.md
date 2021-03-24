---
layout: default
title: Configuring tests
parent: Getting tests running
nav_order: 1
---

# Configuring tests

## PHPUnit

```
SYMFONY_DEPRECATIONS_HELPER: weak
SIMPLETEST_DB: mysql://db:db@db:3306/db
SIMPLETEST_BASE_URL: http://web
BROWSERTEST_OUTPUT_DIRECTORY: /var/www/html/private/browsertest_output
BROWSERTEST_OUTPUT_BASE_URL: $DDEV_PRIMARY_URL
MINK_DRIVER_ARGS_WEBDRIVER: '["chrome", {"browserName":"chrome","chromeOptions":{"args":["--disable-gpu","--headless", "--no-sandbox"]}}, "http://chromedriver:9515"]'
```

## Nightwatch

```
DRUPAL_TEST_BASE_URL: http://web
DRUPAL_TEST_DB_URL: mysql://db:db@db:3306/db
DRUPAL_TEST_WEBDRIVER_HOSTNAME: chromedriver
DRUPAL_TEST_WEBDRIVER_PORT: 9515
DRUPAL_TEST_CHROMEDRIVER_AUTOSTART: 'true'
DRUPAL_TEST_WEBDRIVER_CHROME_ARGS: "--disable-gpu --headless --no-sandbox"
DRUPAL_NIGHTWATCH_OUTPUT: reports/nightwatch
DRUPAL_NIGHTWATCH_IGNORE_DIRECTORIES: node_modules,vendor,.*,sites/*/files,sites/*/private,sites/simpletest
```
