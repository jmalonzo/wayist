
var wayist = angular.module('wayist', ['ngRoute'])
    .config(["$locationProvider", "$routeProvider", function($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider
        .when('/:author', {
          controller: 'ContentController',
          templateUrl: '/wayist/content.html'
        })
        .otherwise({
          redirectTo: '/wayist/beck'
        });
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

  wayist.controller('ContentController', ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
    var authorContent = [];
    $scope.author = $routeParams.author;
    $http.get("/wayist/data/" + $routeParams.author + ".json").success(function(response) {
      var content = response[0];
      for (var c in content) {
        if (!content.hasOwnProperty(c)) {
          continue;
        }
        authorContent.push(c + ": " + content[c]);
      }
    }).error(function() {
      // Do something here
    });

    $scope.content = function() {
      return authorContent;
    };
  }]);

  wayist.controller('AuthorController', ["$scope", "$http", "$anchorScroll", function($scope, $http, $anchorScroll) {
    // Initialize the data
    var authors = [];

    $http.get("/wayist/data/authors.json").success(function(response) {
        authors = response;
      }).error(function() {
        // Do something here
      });
    
    $scope.authors = function() {
      return authors;
    };
  }]);
})();
