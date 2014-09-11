// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var PluginDispatcher = require('../dispatcher/PluginDispatcher');
var PluginConstants = require('../constants/PluginConstants');
var GradientStore = require('../stores/GradientStore');

var ActionTypes = PluginConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _colorStops = {},
    _i = 0;


var ColorStopStore = merge(EventEmitter.prototype, {

  init: function() {
    var gradients = GradientStore.getAll();

    gradients.forEach(function(gradient) {
      gradient.colorStops.forEach(function(colorStop) {
        var _id = (new Date).getTime() + (_i++);
        colorStop.id = _id;
        colorStop.gradientId = gradient.id;
        _colorStops[_id] = colorStop;
      }, this);
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
    return _colorStops[id];
  },

  getAll: function() {
    var items = [];
    _colorStops.forEach(function(colorStop) {
      items.push(colorStop);
    }, this);
    return items;
  },

  getAllForGradient: function(gradientId) {
    var colorStops = [];

    _colorStops.forEach(function(colorStop) {
      if (colorStop.gradientId == gradientId) {
        colorStops.push(colorStop);
      }
    });

    return colorStops;
  }

});

ColorStopStore.dispatchToken = PluginDispatcher.register(function(payload) {
  PluginDispacher.waitFor([
    GradientStore.dispatchToken
  ]);

  var action = payload.action;
  switch(action.type) {

    case ActionTypes.RECEIVE_RAW_GRADIENTS:
      ColorStopStore.init();
      ColorStopStore.emitChange();
      break;

    default:
      // do nothing

  }
});

module.exports = ColorStopStore;
