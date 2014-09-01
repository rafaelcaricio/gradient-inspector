// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


// function to be injected in the context of the inspected page.
var inspectElement = function() {
  var styles = getComputedStyle($0, false);

  return { __proto__: null,
    backgroundImage: styles.backgroundImage.toString(),
    width: styles.width.toString(),
    height: styles.height.toString()
  };
}


chrome.devtools.inspectedWindow.eval(
  "(" + inspectElement + ")();",
  function(result, isException) {
    var container = document.querySelector('#layers');
    if (isException) {
      container.innerHTML = "<small>Not possible to get element info or element does not use gradients.</small>";
    } else {
      displayResult(result);
    }
  }
);


function displayResult(result) {
  var backgroundImageDefinitions = parseDefinitions(result.backgroundImage);
  plotLayers(result, backgroundImageDefinitions);
}


function parseDefinitions(literalDefinitions) {
  var rules = literalDefinitions.split(/\w+\-gradient/),
    rulesTypes = literalDefinitions.match(/(\w+)\-gradient/g),
    layers = [];

  rules.forEach(function(layer, i) {
    if (layer !== '') {
      layer = layer.replace(/\, *$/, '')
      layerDefinition = rulesTypes[i - 1] + layer;
      layers.push(layerDefinition);
    }
  });

  return layers;
}


function plotLayers(inspectedElementStyle, layers) {
  var container = document.querySelector('#layers'),
      template = document.querySelector('#visual-sample-template');

  layers.forEach(function(layer, i) {
    var content = template.cloneNode(true).content,
      visualSample = content.querySelector('.visual-sample'),
      label = content.querySelector('.label');

    visualSample.style.width = inspectedElementStyle.width;
    visualSample.style.height = inspectedElementStyle.height;
    visualSample.style.backgroundImage = layer;

    label.innerHTML = layer;
    label.style.width = inspectedElementStyle.width;

    container.appendChild(document.importNode(content, true));
  });
}
