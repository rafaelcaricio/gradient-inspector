
var TemplateRender = function() {
};

TemplateRender.prototype.render = function(scope) {
  var template = document.querySelector(this.selector);
  this.content = template.cloneNode(true).content;
  this.content = document.importNode(this.content, true);
  this.bindData(scope);
  return this.content;
};

TemplateRender.prototype.bindToContent = function(scope, config) {
  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      element.innerHTML = scope[config.scope];
    },
    changesFromScope: function(scope, element) {
      element.innerHTML = scope[config.scope];
    },
    listenChangesFromElement: function(scope, element) {
    }
  });
};

TemplateRender.prototype.bindToValue = function(scope, config) {
  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      element.value = scope[config.scope];
    },
    changesFromScope: function(scope, element) {
      element.value = scope[config.scope];
    },
    listenChangesFromElement: function(scope, element) {
      element.addEventListener('keyup', function(ev) {
        scope[config.scope] = element.value;
      });
    }
  });
};

TemplateRender.prototype.bindToDOM = function(scope, config) {
  this._bindToElement(scope, config, {
    initialState: function(scope, element) {
      // set callback return as appendChild
    },
    changesFromScope: function(scope, element) {
      // delete all child and append again appendChild
    },
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
      toggle(element, scope[config.scope]);
    },
    changesFromScope: function(scope, element) {
      toggle(element, scope[config.scope]);
    },
    listenChangesFromElement: function(scope, element) {
      // do nothing
    }
  });
};

TemplateRender.prototype._bindToElement = function(scope, config, events) {
  var elements = this.content.querySelectorAll(config.sel);
  Object.observe(scope, function(changes) {
    changes.forEach(function(change) {
      if (change.name == config.scope) {
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
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

var GradientTemplateRender = extendClass(TemplateRender, {
  selector: '#grad-templ',
  bindData: function(scope) {
    this.bindToContent(scope, {sel: 'label', scope: 'name'});

    this.bindToValue(scope, {sel: '#input1', scope: 'name'});
    this.bindToValue(scope, {sel: '#input2', scope: 'name'});

    this.bindToVisible(scope, {sel: 'label.dwa', scope: 'name', condition: function(value) {
      return value == 'show it!';
    }});

    this.bindToDOM(scope, {sel: '#layers', scope: 'layers', callback: function() {
      // render subtemplate elements
    }});
  }
});
