angular.module('services.chrome', []).factory('chromeService', [function() {

  // function to be injected in the context of the inspected page.
  var inspectElement = function() {
    var styles = getComputedStyle($0, false);

    return { __proto__: null,
        backgroundImage: styles.backgroundImage,
        width: styles.width,
        height: styles.height
    };
  };

  return {
    inspectElement: function() {
      return new Promise(function(resolve, reject) {
        resolve({ __proto__: null,
            backgroundImage: 'linear-gradient(to bottom, transparent 0px, rgba(1,1,1,0) 128px, #f3e2c3 128px, #f3e2c3 100%), radial-gradient(circle at 87.23px 134px, #f3e2c3 11px, transparent 11px), radial-gradient(circle at 87px 129px, #000 12px, transparent 12px), radial-gradient(circle at 87.23px 134px, rgb(243, 226, 195) 11px, transparent 11px), linear-gradient(123deg, transparent 0px, rgba(243, 226, 195, 0) 203px, #000 203px, #000 207px, #f3e3c3 207px), linear-gradient(60deg, #f3e2c3 0px, rgba(243, 226, 195, 1) 33px, #000 33px, #000 38px, transparent 38px), linear-gradient(to bottom, transparent 0px, transparent 122px, #000 122px, #000 128px, transparent 128px), linear-gradient(55deg, transparent 0px, transparent 187px, #000 187px), linear-gradient(77deg, transparent 0px, transparent 177px, #f3e2c3 177px), linear-gradient(41deg, transparent 0px, transparent 160px, #000 160px), linear-gradient(82deg, transparent 0px, transparent 148px, #f3e2c3 148px), linear-gradient(51deg, transparent 0px, transparent 153px, #000 153px), radial-gradient(circle at 170px 96px, #f3e2c3 68px, transparent 11px), radial-gradient(circle at 191px 19px, #000 114px, transparent 11px), linear-gradient(-31deg, transparent 0px, transparent 170px, #000 170px)',
            width: '120px',
            height: '120px'
        });

        // chrome.devtools.inspectedWindow.eval(
        //   "(" + inspectElement + ")();",
        //   function(result, isException) {
        //     if (isException) {
        //       reject();
        //     } else {
        //       resolve(result);
        //     }
        //   }
        // );
      });
    }
  };
}]);
