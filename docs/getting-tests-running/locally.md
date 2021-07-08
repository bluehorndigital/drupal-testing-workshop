---
layout: default
title: Locally
parent: Getting tests running
nav_order: 2
---

# Locally

To run all of Drupal's test suites, we will need:

* A local web server
* SQLite
* Chromedriver

## Built-in PHP Web server

In one terminal window

```
cd web
php -S 127.0.0.1:8080 .ht.router.php
```

## SQLite

All you need to do is have SQLite present, there is nothing to run.

### Installation

macOS and Linux

```
brew install sqlite
```

## Chromedriver

### Install chromedriver to machine

Install via homebrew and launch

```
brew install chromedriver
```

### Use as a dependency from Drupal

Drupal has Chromedriver as a dependency for Nightwatch and it can be run from there.

We don't just install, but also bump the version. Your version of Chrome is likely
to be higher than the one pinned and used in Drupal.org's testing infra

```
cd web/core
yarn install
# Ensure compatible chromedriver, probably. Or install Chromedriver
yarn add -D chromedriver@latest
```

### Running Chromedriver

Locally

```
chromedriver
```

Through `node_modules`

```
./web/core/node_modules/.bin/chromedriver
```

# Run tests

## PHPUnit

Copy the `web/core/phpunit.xml.dist` to `web/core/phpunit.xml`

```
cd web
cp core/phpunit.xml.dist core/phpunit.xml
```

Modify phpunit.xml

```
SIMPLETEST_BASE_URL=http:/127.0.0.1:8080
SIMPLETEST_DB=sqlite://localhost/sites/default/files/db.sqlite
BROWSERTEST_OUTPUT_DIRECTORY=../private/browser_output
MINK_DRIVER_ARGS_WEBDRIVER: '["chrome", {"browserName":"chrome","chromeOptions":{"args":["--disable-gpu", "--no-sandbox"]}}, "http://127.0.0.1:9515"]'
```

Run some tests!

```
cd web
php ../vendor/bin/phpunit -c core/phpunit.xml core/modules/action
```

## Nightwatch

Copy the `web/core/.env.example` to `web/core/.env`

```
cd web/core
cp .env.example .env
```

Modify the .env

```
DRUPAL_TEST_BASE_URL=http://127.0.0.1:8080
DRUPAL_TEST_CHROMEDRIVER_AUTOSTART=false
```

Run some tests!

```
cd web/core
yarn test:nightwatch --tag core
```
