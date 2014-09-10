// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var PluginDispacher = require('../dispatcher/PluginDispacher');
var PluginConstants = require('../constants/PluginConstants');

var ActionTypes = PluginConstants.ActionTypes;
var CHANGE_EVENT = 'change';
