// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var Dispatcher = require('flux').Dispatcher;
var copyProperties = require('react/lib/copyProperties');

var PluginConstants = require('../constants/PluginConstants');

var PayloadSources = PluginConstants.PayloadSources;


var PluginDispatcher = copyProperties(new Dispatcher(), {

  handleBrowserAction: function(action) {
    var payload = {
      source: PayloadSources.BROWSER_ACTION,
      action: action
    };
    this.dispatch(payload);
  }

});

module.exports = PluginDispatcher;
