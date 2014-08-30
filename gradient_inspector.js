// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


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
  var container = document.querySelector('#layers'),
      template = document.querySelector('#visual-sample-template');

  info.layers.forEach(function(layer, i) {
    var content = template.cloneNode(true).content,
      visualSample = content.querySelector('.visual-sample'),
      label = content.querySelector('.label');

    visualSample.style.width = info.width;
    visualSample.style.height = info.height;
    visualSample.style.backgroundImage = layer;

    label.innerHTML = layer;
    label.style.width = info.width;

    container.appendChild(document.importNode(content, true));
  });
}


chrome.devtools.inspectedWindow.eval(
  "(" + inspectElement + ")();",
  function(result, isException) {
    if (isException) {
      document.querySelector('#layers').innerHTML = "<small>Not possible to get element info or element does not use gradients.</small>";
    } else {
      plotLayers(result);
    }
  }
);
