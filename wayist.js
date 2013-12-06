
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

  wayist.controller('AppController', ["$scope", "$http", "$location", "$anchorScroll", function($scope, $http, $location, $anchorScroll) {

    // Initialize the data
    var data,
        authors = [],
        authorContent = [];

    $http.get('/wayist/ttch.json').success(function(response) {
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
