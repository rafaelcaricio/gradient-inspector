/* copyright (c) 2014 rafael caricio. all rights reserved.
 * use of this source code is governed by a bsd-style license that can be
 * found in the license file.
 *
 * @jsx React.DOM
 */

var React = require('react');

var GradientsSection = require('../components/GradientsSection.jsx');


var GradientInspectorPlugin = React.createClass({

  render: function() {
    return (<div className="gradient-inspector">
      <div className="header">
        <h1>Element Gradients</h1>
      </div>
      <GradientsSection />
    </div>);
  }

});

module.exports = GradientInspectorPlugin;
