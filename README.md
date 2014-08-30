gradient-inspector
==================

Chrome Extension that adds a sidebar to the Developer Tools that displays information about the gradients applied to the inspected element.

![](https://github.com/rafaelcaricio/gradient-inspector/blob/master/screenshot.jpg)

Development instructions
------------------------

If you wanna make any modifications to this plugin you can use the utility file that can be found at `test/development.html`. It will run the actual extension code in the one page including the javascript inspection code. You can modify the extension code and just refresh that page. This development code was created because it is very difficult to debug errors in the extension when it is installed in Chrome.

You need a webserver to load the `test/development.html` file properly in your browser. You can just run:

```
make
```

and access `http://localhost:8080` in your Chrome browser.
