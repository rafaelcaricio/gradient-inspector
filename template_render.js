
var TemplateRender = function() {
};

TemplateRender.prototype.render = function(scope) {
  var template = document.querySelector(this.selector);
  this.content = template.cloneNode(true).content;
  this.content = document.importNode(this.content, true);
  this.bindData(scope);
  return this.content;
};

TemplateRender.prototype.$ = function(selector) {
  return this.content.querySelectorAll(selector);
};

TemplateRender.prototype.bindToContent = function(scope, config) {
  var applyValueToElement = function(scope, element) {
    element.innerHTML = scope[config.scopeKey];
  };
  this._bindToElement(scope, config, {
    initialState: applyValueToElement,
    changesFromScope: applyValueToElement,
    listenChangesFromElement: function(scope, element) {
    }
  });
};

TemplateRender.prototype.bindToValue = function(scope, config) {
  var applyValueToElement = function(scope, element) {
    element.value = scope[config.scopeKey];
  };
  this._bindToElement(scope, config, {
    initialState: applyValueToElement,
    changesFromScope: applyValueToElement,
    listenChangesFromElement: function(scope, element) {
      element.addEventListener('keyup', function(ev) {
        scope[config.scopeKey] = element.value;
      });
    }
  });
};

function isArray(obj) {
  return obj.hasOwnProperty('length');
}

TemplateRender.prototype.bindToDOM = function(scope, config) {
  var elements = config.elements;

  var watchArrayChanges = function(scope) {
    var internalValue = scope[config.scopeKey];
    if (isArray(internalValue)) {
      Object.observe(internalValue, function() {
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          element.innerHTML = '';
          config.onChange(scope, element);
        }
      });
    }
  }, self = this;

  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      element.innerHTML = '';
      config.onChange(scope, element);
      watchArrayChanges.bind(self)(scope);
    },
    changesFromScope: function(scope, element) {
      element.innerHTML = '';
      config.onChange(scope, element);
      watchArrayChanges.bind(self)(scope);
    },
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype.bindToStyle = function(scope, config) {
  var calculateResult = (function(scope) {
    return eval("(" + config.expression + ")");
  });
  var applyStyle = function(scope, element) {
    var newStyles = calculateResult(scope);
    for (var key in newStyles) {
      element.style[key] = newStyles[key];
    }
  }
  this._bindToElement(scope, config, {
    initialState: applyStyle,
    changesFromScope: applyStyle,
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype.bindToVisible = function(scope, config) {
  var toggle = function(element, value) {
    if (config.condition(value)) {
      element.style.visibility = 'visible';
    } else {
      element.style.visibility = 'hidden';
    }
  };
  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      toggle(element, scope[config.scopeKey]);
    },
    changesFromScope: function(scope, element) {
      toggle(element, scope[config.scopeKey]);
    },
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype._bindToElement = function(scope, config, events) {
  var elements = config.elements;
  Object.observe(scope, function(changes) {
    changes.forEach(function(change) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (config.scopeKey) {
          // execute local changes in a variable in the scope
          if (change.name == config.scopeKey) {
            events.changesFromScope(scope, element);
          }
        } else if (config.expression) {
          // execute global changes in the scope
          events.changesFromScope(scope, element);
        }
      }
    });
  });

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    events.listenChangesFromElement(scope, element);
    events.initialState(scope, element);
  }
};


function extendClass(xClass, proto) {
  var newClass = function() {}, attr;
  for (attr in xClass.prototype) {
    newClass.prototype[attr] = xClass.prototype[attr];
  }
  for (attr in proto) {
    newClass.prototype[attr] = proto[attr];
  }
  return newClass;
}

var sampleContext = {
  name: 'Rafael',
  color: 'red',
  layers: [
    {title: 'First', content: 'something'},
    {title: 'Second', content: 'another thing'}
  ]
};

var TestLayerTemplateRender = extendClass(TemplateRender, {
  selector: '#layer-templ',
  bindData: function(scope) {
    this.bindToContent(scope, {elements: this.$('label'), scopeKey: 'title'});
    this.bindToContent(scope, {elements: this.$('small'), scopeKey: 'content'});
  }
});

var TestGradientTemplateRender = extendClass(TemplateRender, {
  selector: '#grad-templ',
  bindData: function(scope) {

    this.bindToContent(scope, {elements: this.$('label'), scopeKey: 'name'});

    this.bindToValue(scope, {elements: this.$('#input1'), scopeKey: 'name'});
    this.bindToValue(scope, {elements: this.$('#input2'), scopeKey: 'name'});

    this.bindToStyle(scope, {elements: this.$('.text'), expression: "{'color': scope.color}"});

    this.bindToVisible(scope, {elements: this.$('.dwa'), scopeKey: 'name', condition: function(value) {
      return value == 'show it!';
    }});

    this.bindToDOM(scope, {elements: this.$('#layers'), scopeKey: 'layers', onChange: function(scope, element) {
      for (var i = 0; i < scope.layers.length; i++) {
        var content = (new TestLayerTemplateRender()).render(scope.layers[i]);
        element.appendChild(content);
      }
    }});

  }
});
