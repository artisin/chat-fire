var path = require("path");
var settings = {
  "v8": {
    "flags" : [                       // DEFAULT=[]; https://github.com/thlorenz/v8-flags/blob/master/flags-0.11.md
      // "--harmony-arrow-functions"
      "--harmony"
    ]
  },
  "app": {
    "native+"               : true,   // DEFAULT=FALSE; extends require to search native modules respecting the current v8 engine version.
    "autoAddWorkSpace"      : false,  // DEFAULT=TRUE; disables the autoAddWorkSpace behavior.
    "openDevToolsDetached"  : true,  // DEFAULT=FALSE; opens the dev tools windows detached in an own window.
    "hideMainWindow"        : true,  // DEFAULT=FALSE;  hides the main window to show dev tools only.
  }
};

module.exports = settings;
