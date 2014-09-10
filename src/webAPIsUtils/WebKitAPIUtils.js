// copyright (c) 2014 rafael caricio. all rights reserved.
// use of this source code is governed by a bsd-style license that can be
// found in the license file.

var GradientParser = require('gradient-parser');

var BrowserActionCreators = require('../actions/BrowserActionCreators');

module.exports = {

  getGradients: function() {
    chrome.devtools.inspectedWindow.eval(
      "(" + inspectElement + ")($0);",
      function(result, isException) {
        var gradients = GradientParser.parse(result.backgroundImage);
        BrowserActionCreators.receiveAll(gradients);
      }
    );
  }

};

// functions to be injected in the context of the inspected page.

var inspectElement = function(element) {
  var styles = getComputedStyle(element, false);

  return { __proto__: null,
    backgroundImage: styles.backgroundImage,
    width: styles.width,
    height: styles.height
  };
}
