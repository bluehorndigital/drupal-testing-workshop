---
layout: default
title: Locally
parent: Getting tests running
nav_order: 2
---

# Locally

In one terminal window

```
cd web
php -S 127.0.0.1:8080 .ht.router.php
```

In another terminal, launched chromedriver

```
chromedriver
```

Then install dependencies

```
cd web/core
yarn install
# Ensure compatible chromedriver, probably. Or install Chromedriver
yarn add -D chromedriver@latest
```

Run tests

```
cd web/core
yarn test:nightwatch --tag core
```
