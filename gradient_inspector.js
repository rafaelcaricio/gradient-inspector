// Copyright (c) 2014 Rafael Caricio. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


// function to be injected in the context of the inspected page.
var inspectElement = function() {
  var styles = getComputedStyle($0, false);

  return { __proto__: null,
    backgroundImage: styles.backgroundImage,
    width: styles.width,
    height: styles.height
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


var applyNewStyle = function(element, backgrounImage) {
  var getDynamicStyle =  function() {
    var styleId = 'gradient-inspector-rules',
      dynamicStyle = document.querySelector('#' + styleId);

    if (!dynamicStyle) {
      dynamicStyle = document.createElement('style');
      dynamicStyle.setAttribute('id', styleId);
      document.getElementsByTagName('head')[0].appendChild(dynamicStyle);
    }

    return dynamicStyle.sheet;
  }

  var apply = function(dynamicStyle) {
    var elemId = element.getAttribute('id');
    if (!elemId) {
      elemId = 'gradient-inspector-' + (new Date).getTime().toString();
      element.setAttribute('id', elemId);
    }

    try {
      dynamicStyle.removeRule(0);
    } catch(e) { }

    dynamicStyle.insertRule("#" + elemId + " {\
      background-image: ## !important;\
    }".replace("##", backgrounImage || 'none'), 0);
  }

  apply(getDynamicStyle());
}


function toggleLayer(e) {
  var toActivate = document.querySelectorAll('#layers input:checked'),
    activeLayers = [];

  for (var i = 0; i < toActivate.length; i++) {
    activeLayers.push(toActivate[i].value);
  }

  chrome.devtools.inspectedWindow.eval(
    '(' + applyNewStyle + ')($0,"##");'.replace("##", activeLayers.toString()),
    function(result, isException) { }
  );
}


function plotLayers(inspectedElementStyle, layers) {
  var container = document.querySelector('#layers'),
      template = document.querySelector('#visual-sample-template');

  layers.forEach(function(layer, i) {
    var content = template.cloneNode(true).content,
      visualSample = content.querySelector('.visual-sample'),
      info = content.querySelector('.info'),
      label = content.querySelector('label'),
      input = content.querySelector('input'),
      layerId = "vs-" + i;

    visualSample.style.width = inspectedElementStyle.width;
    visualSample.style.height = inspectedElementStyle.height;
    visualSample.style.backgroundImage = layer;

    input.id = layerId;
    input.value = layer;

    label.setAttribute("for", layerId);
    label.innerHTML = layer;
    info.style.width = inspectedElementStyle.width;

    container.appendChild(document.importNode(content, true));

    input = container.querySelector('#' + layerId);
    input.addEventListener("change", toggleLayer, true);
  });
}
