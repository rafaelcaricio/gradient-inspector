// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var PluginDispacher = require('../dispatcher/PluginDispacher');
var PluginConstants = require('../constants/PluginConstants');

var ActionTypes = PluginConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _colorStops = {};


var ColorStopStore = merge(EventEmitter.prototype, {

  init: function(rawGradients) {
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  get: function(id) {
    return _colorStops[id];
  },

  getAll: function() {
    return _colorStops;
  }

});

ColorStopStore.dispatchToken = ChatAppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_GRADIENTS:
      ColorStopStore.init(action.rawGradients);
      ColorStopStore.emitChange();
      break;

    default:
      // do nothing

  }
});

module.exports = ColorStopStore;
