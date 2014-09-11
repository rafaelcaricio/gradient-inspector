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

React.renderComponent(
  <GradientInspectorPlugin />,
  document.body
);
