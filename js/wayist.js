
var wayist = angular.module('wayist', ['ngRoute'])
    .config(["$routeProvider", function($routeProvider) {
      $routeProvider
        .when('/a/:author', {
          controller: 'AuthorContentController',
          templateUrl: '/wayist/content.html'
        })
        .when('/c/:chapter', {
          controller: 'ChapterContentController',
          templateUrl: '/wayist/chapter.html'
        })
        .otherwise({
          redirectTo: function() {
            var author = window.localStorage.getItem('author');
            return author ? "/a/" + author : "/beck";
          }
        });
    }]);

(function() {
  "use strict";

  wayist.filter('capitalize', function() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substring(1);
    };
  });

  wayist.controller('ChapterContentController', ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
    var section,
        sectionContent;
    $scope.sectionList = [];
    $http.get("/wayist/data/" + $routeParams.chapter + ".json")
      .success(function(response) {
        for (var i = 0; i < response.length; i++) {
          section = response[i];
          sectionContent = [];
          for (var c in section.content) {
            if (!section.content.hasOwnProperty(c)) {
              continue;
            }
            sectionContent.push({author: c, text: section.content[c]});
          }
          $scope.sectionList.push({name: section.section, content: sectionContent.sort(comparator)});
        }
      })
      .error(function() {
        // Do something here
      });

    $scope.sections = function() {
      return $scope.sectionList;
    };
    $scope.orderPredicate = 'author';

    function comparator (a,b) {
      if (a.author > b.author) return 1;
      if (a.author < b.author) return -1;
      return 0;
    }

  }]);

  wayist.controller('AuthorContentController', ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {
    var authorContent = [];
    $scope.author = $routeParams.author;
    $http.get("/wayist/data/" + $routeParams.author + ".json")
      .success(function(response) {
        var content = response[0];
        for (var c in content) {
          if (!content.hasOwnProperty(c)) {
            continue;
          }
          authorContent.push(c + ". " + content[c]);

          // Store selected author in localStorage for future sessions
          localStorage.setItem('author', $scope.author);
        }
      }).error(function() {
        // Do something here
      });

    $scope.content = function() {
      return authorContent;
    };
  }]);

  wayist.controller('AuthorController', ["$scope", "$http", function($scope, $http) {
    // Initialize the data
    $scope.authorList = [];
    $http.get("/wayist/data/authors.json")
      .success(function(response) {
        $scope.authorList = response;
      }).error(function() {
        // Do something here
      });
    
    $scope.authors = function() {
      return $scope.authorList;
    };

    $scope.selectedAuthor = function() {
      var author = window.localStorage.getItem('author');    
      return  author ? author : "by their respective authors.";
    };
  }]);

  wayist.controller('ChapterController', ["$scope", "$http", function($scope, $http) {
    $scope.chapterList = [];
    $http.get("/wayist/data/chapters.json")
      .success(function(response) {
        $scope.chapterList = response;
      }).error(function() {
        // Do something here
      });
    
    $scope.chapters = function() {
      return $scope.chapterList;
    };

  }]);
})();

