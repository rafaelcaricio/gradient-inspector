/* copyright (c) 2014 rafael caricio. all rights reserved.
 * use of this source code is governed by a bsd-style license that can be
 * found in the license file.
 *
 * @jsx React.DOM
 */

var React = require('react');

var GradientStore = require('../stores/GradientStore');
var Gradient = require('../components/Gradient.jsx');


var getStateFromStores = function() {
  return {
    gradients: GradientStore.getAll()
  };
};


var getGradientItem = function(gradient) {
  return (
    <Gradient key={gradient.id} item={gradient} />
  );
};

var GradientsSection = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    GradientStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GradientStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var gradientsLayers = this.state.gradients.map(getGradientItem);

    return (
      <div id="layers">
        {gradientsLayers}
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = GradientsSection;
