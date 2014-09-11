/* copyright (c) 2014 rafael caricio. all rights reserved.
 * use of this source code is governed by a bsd-style license that can be
 * found in the license file.
 *
 * @jsx react.dom
 */

var react = require('react');


var Gradient = React.createClass({

  render: function() {
    return (
      <div class="visual-sample-container">
        <div class="visual-sample"></div>
        <div class="info">
          <input type="checkbox" />
          <label>{this.props.gradient.type}</label>
        </div>
      </div>
    );
  },

  _onChange: function() {
    // this.setState(getStateFromStores());
  }

});

module.exports = Gradient;
