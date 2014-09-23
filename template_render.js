
var TemplateRender = function(selector) {
  if (selector) {
    this.selector = selector;
  }
};

TemplateRender.prototype.getContent = function() {
  if (!this.content) {
    var template = document.querySelector(this.selector);
    this.content = template.cloneNode(true).content;
    this.content = document.importNode(this.content, true);
  }
  return this.content;
};

TemplateRender.prototype.render = function(scope) {
  this.getContent();
  if (this.bindData) {
    this.bindData(scope);
  }
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

TemplateRender.prototype.executeInScope = function(scope, expr) {
  return (function(scope) {
    return eval("(function a(){with(scope){return(" + expr + ")}})()");
  })(scope);
};

TemplateRender.prototype.bindToStyle = function(scope, config) {
  var applyStyle = function(scope, element) {
    var newStyles = this.executeInScope(scope, config.expression);
    for (var key in newStyles) {
      element.style[key] = newStyles[key];
    }
  }.bind(this);
  this._bindToElement(scope, config, {
    initialState: applyStyle,
    changesFromScope: applyStyle,
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype.bindToVisible = function(scope, config) {
  var toggle = function(scope, element) {
    if (this.executeInScope(scope, config.expression)) {
      element.style.visibility = 'visible';
    } else {
      element.style.visibility = 'hidden';
    }
  }.bind(this);
  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      toggle(scope, element);
    },
    changesFromScope: function(scope, element) {
      toggle(scope, element);
    },
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype.bindForEach = function(scope, config) {
  this.bindToDOM(scope, {elements: config.container, scopeKey: config.scopeKey, onChange: function(scope, element) {
    for (var i = 0; i < scope[config.scopeKey].length; i++) {
      var content = (new config.template()).render(scope.layers[i]);
      element.appendChild(content);
    }
  }});
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


var InlineAnnotations = function(template) {
  this.mapping = {
    'ng-bind': {
      method: 'bindToContent',
      config: function(element, attrValue) {
        return {elements: [element], scopeKey: attrValue};
      }
    },
    'ng-model': {
      method: 'bindToValue',
      config: function(element, attrValue) {
        return {elements: [element], scopeKey: attrValue};
      }
    },
    'ng-style': {
      method: 'bindToStyle',
      config: function(element, attrValue) {
        return {elements: [element], expression: attrValue};
      }
    },
    'ng-show': {
      method: 'bindToVisible',
      config: function(element, attrValue) {
        return {elements: [element], expression: attrValue};
      }
    }
  };
  this.template = template;
};

InlineAnnotations.prototype.parse = function(scope) {
  this.parseNodes(scope, this.template.getContent().childNodes[0]);
  return this.template.getContent();
};

InlineAnnotations.prototype.parseNodes = function(scope, rootNode) {
  if (!rootNode) {
    return;
  }

  if (rootNode.getAttribute) {
    for (var magicalAttribute in this.mapping) {
      var attrValue = rootNode.getAttribute(magicalAttribute);
      if (attrValue) {
        var mapSettings = this.mapping[magicalAttribute];
        this.template[mapSettings.method](scope, mapSettings.config(rootNode, attrValue));
      }
    }
  }

  this.parseNodes(scope, rootNode.nextElementSibling);
  for (var i = 0; i < rootNode.childNodes.length; i++) {
    this.parseNodes(scope, rootNode.childNodes[i]);
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

    this.bindToStyle(scope, {elements: this.$('.text'), expression: "{'color': color}"});

    this.bindToVisible(scope, {elements: this.$('.dwa'), expression: "name == 'show it!'"});

    this.bindForEach(scope, {container: this.$('#layers'), scopeKey: 'layers', template: TestLayerTemplateRender});

  }
});


var sampleContext = {
  name: 'Rafael',
  color: 'red',
  layers: [
    {title: 'First', content: 'something'},
    {title: 'Second', content: 'another thing'}
  ]
};

function main() {
  //document.querySelector('#cont').appendChild((new TestGradientTemplateRender()).render(sampleContext));

  var inlineParser = new InlineAnnotations(new TemplateRender('#grad-templ'));
  var result = inlineParser.parse(sampleContext);
  document.querySelector('#cont').appendChild(result);
}
