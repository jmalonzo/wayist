describe("wayist", function() {
  // Initialize module beforee each and every test
  beforeEach(module('wayist'));

  describe("capitalize", function() {
    it("should be able to capitalize author names", inject(function(capitalizeFilter) {
      expect(capitalizeFilter("mitchell")).toBe("Mitchell");
      expect(capitalizeFilter("legge")).toBe("Legge");
    }));
  });

  describe("AuthorController", function() {
    var $httpBackend, $rootScope, scope, origLocalStorage;
    beforeEach(inject(function(_$rootScope_, _$httpBackend_, $controller) {
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      scope  = $rootScope.$new();
      $controller("AuthorController", {
        $scope: scope
      });

      origLocalStorage = window.localStorage;
      var store = Object.create(null);
      store.getItem = function(key) {
        return store[key];
      };
      store.setItem = function(key, value) {
        store[key] = value + '';
      };
      store.clear = function() {
        store = Object.create(null);
      };
      Object.defineProperty(window, "localStorage", {value: store, writeable: true, configurable: true, enumerable: true});
      spyOn(window.localStorage, 'getItem').andCallThrough();
      spyOn(window.localStorage, 'setItem').andCallThrough();
    }));

    afterEach(inject(function() {
      Object.defineProperty(window, "localStorage", {value: origLocalStorage, writeable: true, configurable: true, enumerable: true});
    }));


    it("should be able to return the list of authors", function() {
      $httpBackend.expect("GET", "/wayist/data/authors.json")
        .respond(["beck", "blackney", "bynner", "mitchell", "wu"]);

      scope.authors();
      scope.$root.$digest();
      $httpBackend.flush();
      expect(scope.authorList).toEqual(["beck", "blackney", "bynner", "mitchell", "wu"]);
    });

    it("should be able to return copyright text", function() {
      expect(scope.selectedAuthor()).toEqual("by their respective authors.");
      expect(window.localStorage.getItem).toHaveBeenCalled();
      window.localStorage.setItem('author', 'Wu');
      expect(scope.selectedAuthor()).toEqual('Wu');
      expect(window.localStorage.getItem).toHaveBeenCalled();
    });
  });
});
