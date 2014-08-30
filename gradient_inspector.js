// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var container = document.querySelector('#layers');

// function to be injected in the context of the inspected page.
var inspectElement = function() {
  var styles = getComputedStyle($0, false),
    definitions = styles.backgroundImage,
    layerDefinition = null,
    rules = definitions.split(/\w+\-gradient/),
    rulesTypes = definitions.match(/(\w+)\-gradient/g),
    result = { __proto__: null,
      layers: [],
      width: styles.width,
      height: styles.height
    };

  rules.forEach(function(layer, i) {
    if (layer !== '') {
      layer = layer.replace(/\, *$/, '')
      layerDefinition = rulesTypes[i - 1] + layer;

      result.layers.push(layerDefinition);
    }
  });

  return result;
}

function plotLayers(info) {
  info.layers.forEach(function(layer, i) {
    var visualSample = document.createElement('div');
    visualSample.setAttribute('class', 'visual-sample');
    visualSample.style.width = info.width;
    visualSample.style.height = info.height;
    visualSample.style.backgroundImage = layer;

    container.appendChild(visualSample);
  });
}


chrome.devtools.inspectedWindow.eval(
  "(" + inspectElement + ")();",
  function(result, isException) {
    if (isException) {
      container.innerHTML = "<small>Not possible to get element info or element does not use gradients.</small>";
    } else {
      plotLayers(result);
    }
  }
);
