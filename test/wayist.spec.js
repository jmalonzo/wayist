describe("wayist", function() {
  // Initialize module beforee each and every test
  beforeEach(module('wayist'));

  describe("AuthorController", function() {
    var $httpBackend, $rootScope, scope;
    beforeEach(inject(function(_$rootScope_, _$httpBackend_, $controller) {
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      scope  = $rootScope.$new();
      $controller("AuthorController", {
        $scope: scope
      });
    }));

    it("should be able to return the list of authors", function() {
      $httpBackend.expect("GET", "/wayist/data/authors.json")
        .respond(["beck", "blackney", "bynner", "mitchell", "wu"]);

      scope.authors();
      scope.$root.$digest();
      $httpBackend.flush();
      expect(scope.authorList).toEqual(["beck", "blackney", "bynner", "mitchell", "wu"]);
    });
    
  });
  
});
