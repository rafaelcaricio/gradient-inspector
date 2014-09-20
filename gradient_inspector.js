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
};


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
  var backgroundImageDefinitions = GradientParser.parse(result.backgroundImage);
  plotLayers(result, backgroundImageDefinitions);
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
  };

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
  };

  apply(getDynamicStyle());
};


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

  showCurrentActiveLayers(activeLayers.join(', '));
}

function showCurrentActiveLayers(value) {
  document.querySelector('#footer-area textarea').innerHTML = value;
}

function renderLabel(layer) {
  var html = '<span>' + layer.type + '</span>(',
      orientation = GradientParser.stringify(layer.orientation);

  if (orientation) {
    html += orientation + ', ';
  }

  layer.colorStops.forEach(function(colorStop, i) {
    var colorObj = {type: colorStop.type, value: colorStop.value};

    html += '<span class="color-stop"><i style="background-color: '+ GradientParser.stringify(colorObj) +'"></i> ' + GradientParser.stringify(colorStop) + '</span>';
    if (i < layer.colorStops.length - 1) {
      html += ', ';
    }
  });

  return html;
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
      layerId = "vs-" + i,
      serializedLayer = GradientParser.stringify(layer);

    visualSample.style.width = inspectedElementStyle.width;
    visualSample.style.height = inspectedElementStyle.height;
    visualSample.style.backgroundImage = serializedLayer;

    input.id = layerId;
    input.value = serializedLayer;

    label.setAttribute("for", layerId);
    label.innerHTML = renderLabel(layer);
    info.style.width = inspectedElementStyle.width;

    container.appendChild(document.importNode(content, true));

    input = container.querySelector('#' + layerId);
    input.addEventListener("change", toggleLayer, true);
  });

  showCurrentActiveLayers(GradientParser.stringify(layers));
}
