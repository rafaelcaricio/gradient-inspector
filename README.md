CSS Gradient Inspector
======================

[![Code Climate](https://codeclimate.com/github/rafaelcaricio/gradient-inspector/badges/gpa.svg)](https://codeclimate.com/github/rafaelcaricio/gradient-inspector)

With the addition of a sidebar to Developer Tools, the Chrome Extension displays gradients applied to the inspected element. Toggle each gradient (which are different layers) individually.

[![](https://github.com/rafaelcaricio/gradient-inspector/blob/master/img/screenshot.png)](http://bit.ly/cssGradientInspector)

Installation
------------

You can install this plugin via [Chrome Web Store](http://bit.ly/cssGradientInspector) or [Opera Addons Page](https://addons.opera.com/en/extensions/details/css-gradient-inspector/).

Development instructions
------------------------

If you wanna make any modifications to this plugin you can use the utility file that can be found at `test/development.html`. It will run the actual extension code in the one page including the javascript inspection code. You can modify the extension code and just refresh that page. This development code was created because it is very difficult to debug errors in the extension when it is installed in Chrome.

You need a webserver to load the `test/development.html` file properly in your browser. You can run:

```
make
```

Then access `http://localhost:8080/test/development.html` in your Chrome browser.
