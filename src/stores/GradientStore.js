// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var PluginDispatcher = require('../dispatcher/PluginDispatcher');
var PluginConstants = require('../constants/PluginConstants');

var ActionTypes = PluginConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _gradients = {},
    _i = 0;


var GradientStore = merge(EventEmitter.prototype, {

  init: function(rawGradients) {
    rawGradients.forEach(function(gradient) {
      var _id = (new Date).getTime() + (_i++);
      gradient.id = _id;
      _gradients[_id] = gradient;
    }, this);
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
    return _gradients[id];
  },

  getAll: function() {
    return _gradients;
  }

});

GradientStore.dispatchToken = ChatAppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_GRADIENTS:
      GradientStore.init(action.rawGradients);
      GradientStore.emitChange();
      break;

    default:
      // do nothing

  }
});

module.exports = GradientStore;
