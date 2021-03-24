module.exports = {
  // Tags are how tests are grouped and make it easier to run sets of tests.
  '@tags': ['nightwatch_example', 'workshop'],
  // There isn't a global runner that installs Drupal, like the PHPUnit tests.
  // Each test must implement `before` and install Drupal itself. When calling
  // the `drupalInstall` command, you will want to provide a setup file. This
  // setup file is used to install modules and setup configuration for the test.
  // This setup file is equivelant to setUp in a PHPUnit test.
  before: function (browser) {
    browser.drupalInstall({
      setupFile: 'modules/custom/nightwatch_example/tests/src/Nightwatch/TestSiteInstallTestScript.php',
    });
  },
  // Just as we don't have automated setup, each test must uninstall Drupal.
  after: function (browser) {
    browser
      .drupalUninstall();
  },
  // Now, we may define different tests!
  // There are different commands available, and they are in the
  // tests/Drupal/Nightwatch/Commands directory.
  'Visit a test page': (browser) => {
    browser
      .drupalRelativeURL('/');
    // We execute JavaScript in the browser and assert the result.
    browser.execute(function () {
      // Return the value of our key in Drupal settings.
      return drupalSettings.nightwatchTest;
    }, [], function (result) {
      // Assert the returned value!
      browser.assert.notStrictEqual(result.value, {
        echo: 'Hello World!',
      });
    })
    .end();
  },

};
