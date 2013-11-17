
var wayist = angular.module('wayist', []);

(function() {
  "use strict";

  angular.element(document).ready(function() {
    angular.bootstrap(document, ["wayist"]);
  });

  wayist.controller('AppController', ["$scope", "$http", function($scope, $http) {

    // Initialize the data
    var data,
        authors = [],
        authorContent = [];

    $http.get('/wayist/ttch.json').success(function(response) {
      data = response[0];
      if (!data) return;

      // Cache the authors
      // FIXME in localstorage too
      var authorName = '';
      for (var a in data) {
        if (!data.hasOwnProperty(a)) {
          continue;
        }

        authorName = a.charAt(0).toUpperCase() + a.substring(1);
        authors.push(authorName);

        var ac = data[a];
        var acc = [];
        for (var v in ac) {
          if (!ac.hasOwnProperty(v)) {
            continue;
          }
          acc.push(v + " " + ac[v]);
        }
        authorContent.push({name: authorName, content: acc});

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
  }]);
})();
