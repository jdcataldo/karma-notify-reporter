# karma-notify-reporter

> Report test results using OSX Notification Center, [Growl](http://growl.info/) or notify-send.

[![Downloads](https://img.shields.io/npm/dm/karma-notify-reporter.svg)](https://www.npmjs.com/package/karma-notify-reporter)

Built on top of [node-notifier](https://github.com/mikaelbr/node-notifier).  

By default Notification Center will be used on Mac, notify-send will be used on Linux, and Growl will be used if neither Mac 10.8 or Linux.

## Installation 

```js
npm install karma-notify-reporter --save-dev
```

###

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'notify'],

    // Optional Settings
    notifyReporter: {
      reportEachFailure: true, // Default: false, Will notify on every failed sepc
      reportSuccess: false, // Default: true, Will notify when a suite was successful
    }
  });
};
```

You can pass list of reporters as a CLI argument too:
```bash
karma start --reporters notify,dots
```
