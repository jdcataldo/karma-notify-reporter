var notifier = require('node-notifier'),
    util     = require('util'),
    path     = require('path');

var messages = {
  success : {
    displayName : 'Success',
    title       : 'PASSED - %s',
    message     : '%d tests passed in %s.',
    icon        : path.join(__dirname, 'images/success.png')
  },
  failed : {
    displayName : 'Failure',
    title       : 'FAILED - %s',
    message     : '%d/%d tests failed in %s.',
    icon        : path.join(__dirname, 'images/failed.png')
  },
  error : {
    displayName : 'Aborted',
    title       : 'ERROR - %s',
    message     : '',
    icon        : path.join(__dirname, 'images/error.png')
  },
  specFailed : {
    displayName : 'Spec Failure',
    title       : 'Spec Failed - %s',
    message     : '%s',
    icon        : path.join(__dirname, 'images/failed.png')
  }
};


var NotifyReporter = function(baseReporterDecorator, helper, logger, config, formatError) {
  var log               = logger.create('reporter.notify'),
      reporterConfig    = config.notifyReporter || {},
      reportSuccess     = typeof reporterConfig.reportSuccess !== 'undefined' ? reporterConfig.reportSuccess : true,
      reportEachFailure = typeof reporterConfig.reportEachFailure !== 'undefined' ? reporterConfig.reportEachFailure : true,
      msg;

  baseReporterDecorator(this);

  this.adapters = [];

  this.onBrowserComplete = function(browser) {
    var results = browser.lastResult,
        time    = helper.formatTimeInterval(results.totalTime);

    if (results.disconnected || results.error) {
      var error = results.disconnected ? 'Browser Disconnected' : 'An error occured';
      msg = messages.error;
      return notifier.notify(helper.merge(msg, { 'message' : error, 'title' : util.format(msg.title, browser.name) }));
    }

    if (results.failed) {
      msg = messages.failed;
      return notifier.notify(helper.merge(msg, { 'message' : util.format(msg.message, results.failed, results.total, time), 'title' : util.format(msg.title, browser.name) }));
    }

    if (reportSuccess) {
      msg = messages.success;
      notifier.notify(helper.merge(msg, { 'message' : util.format(msg.message, results.success, time), 'title' : util.format(msg.title, browser.name) }));
    }
  };

  if (reporterConfig.reportEachFailure) {
    this.specFailure = function(browser, result) {
      var specName = result.suite.join(' ') + ' ' + result.description,
          message  = util.format('%s: FAILED\n', specName);

      result.log.forEach(function(log) {
        message += formatError(log, '\t');
      });

      msg = messages.specFailed;
      notifier.notify(helper.merge(msg, { 'message' : util.format(msg.message, message), 'title' : util.format(msg.title, browser.name) }));
    };
  }
};

NotifyReporter.$inject = ['baseReporterDecorator', 'helper', 'logger', 'config', 'formatError'];

module.exports = {
  'reporter:notify' : ['type', NotifyReporter]
};
