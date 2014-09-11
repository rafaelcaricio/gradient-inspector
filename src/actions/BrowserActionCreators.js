// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var PluginDispatcher = require('../dispatcher/PluginDispatcher');
var PluginConstants = require('../constants/PluginConstants');

var ActionTypes = PluginConstants.ActionTypes;


module.exports = {

  receiveAll: function(rawGradients) {
    PluginDispatcher.handleBrowserAction({
      type: ActionTypes.RECEIVE_RAW_GRADIENTS,
      rawGradients: rawGradients
    });
  }

};
