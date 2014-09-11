/* copyright (c) 2014 rafael caricio. all rights reserved.
 * use of this source code is governed by a bsd-style license that can be
 * found in the license file.
 *
 * @jsx React.DOM
 */

var React = require('react');

var GradientInspectorPlugin = require('./components/GradientInspectorPlugin.jsx');
var BrowserAPIUtils = require('./webAPIsUtils/WebKitAPIUtils');


BrowserAPIUtils.getGradients();

var initCall,
  initPlugin = function() {

  var container = document.querySelector('#gradient-inspector-plugin');

  if (container) {
    React.renderComponent(
      <GradientInspectorPlugin />,
      container
    );
    clearTimeout(initCall);
  } else {
    initCall = setTimeout(initPlugin, 300);
  }
};

initCall = setTimeout(initPlugin, 300);
