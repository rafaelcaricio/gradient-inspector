/* copyright (c) 2014 rafael caricio. all rights reserved.
 * use of this source code is governed by a bsd-style license that can be
 * found in the license file.
 *
 * @jsx react.dom
 */

var React = require('react');

var ReactPropTypes = React.PropTypes;


var Gradient = React.createClass({

  render: function() {
    return (
      <div className="visual-sample-container">
        <div className="visual-sample"></div>
        <div className="info">
          <input type="checkbox" />
          <label>{this.props.item.type}</label>
        </div>
      </div>
    );
  },

  _onChange: function() {
    // this.setState(getStateFromStores());
  }

});

module.exports = Gradient;
