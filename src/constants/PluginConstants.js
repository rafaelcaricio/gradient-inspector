// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var keyMirror = require('react/lib/keyMirror');


module.exports = {
  ActionTypes: keyMirror({
    RECEIVE_RAW_GRADIENTS: null
  }),

  PayloadSources: keyMirror({
    BROWSER_ACTION: null,
    VIEW_ACTION: null
  })
};
