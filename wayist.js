
var wayist = angular.module('wayist', [])
    .config(["$locationProvider", function($locationProvider) {
      $locationProvider.html5Mode(true);
    }]);

(function() {
  "use strict";

  angular.element(document).ready(function() {
    angular.bootstrap(document, ["wayist"]);
  });

  wayist.filter('capitalize', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substring(1);
    };
  });

  wayist.directive('spinner', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var spinner = new Spinner({
          lines: 13, // The number of lines to draw
          length: 15, // The length of each line
          width: 6, // The line thickness
          radius: 10, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#aaa', // #rgb or #rrggbb or array of colors
          speed: 1, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: true, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        });

        spinner.spin(element.get(0));

        scope.$on("dataload.done", function() {
          spinner.stop();
        });
      }
    };
  });

  wayist.controller('AppController', ["$scope", "$http", "$location", "$anchorScroll", function($scope, $http, $location, $anchorScroll) {

    // Initialize the data
    var data,
        authors = [],
        authorContent = [];

    $http.get('/wayist/ttch.json').success(function(response) {
      $scope.$broadcast("dataload.done");

      data = response[0];
      if (!data) return;

      for (var a in data) {
        if (!data.hasOwnProperty(a)) {
          continue;
        }

        authors.push(a);

        var ac = data[a];
        var acc = [];
        for (var v in ac) {
          if (!ac.hasOwnProperty(v)) {
            continue;
          }
          acc.push(v + " " + ac[v]);
        }
        authorContent.push({name: a, content: acc});

      }
      authors = authors.sort();
    }).error(function() {
      // Do something here
      spinner.stop();
    });

    $scope.authors = function() {
      return authors;
    };

    $scope.authorContent = function() {
      return authorContent;
    };

    // Scroll accordingly..
    $anchorScroll();

  }]);
})();
