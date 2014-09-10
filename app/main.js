angular.module('app', ['services.chrome']);

angular.module('app').controller('AppCtrl', ['$scope', 'chromeService', function($scope, chromeService) {

  $scope.elementProperties = null;
  $scope.gradients = [];

  chromeService.inspectElement().then(function(result) {

    $scope.$apply(function() {
      try {
        $scope.elementProperties = result;
        $scope.gradients = GradientParser.parse(result.backgroundImage);
        console.log($scope.gradients);
      } catch (e) {
        console.log(e);
      }
    });


  }, function() {

    $scope.errorMessage = "Not possible to get element info or element does not use gradients.";

  });

}]);
