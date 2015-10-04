wtf.controller('profilectrl', ['$scope', '$state', '$http', 'loginservice', 'rulistservice', '$ionicScrollDelegate', '$ionicLoading', 'User',

function($scope, $state, $http, loginservice, rulistservice, $ionicScrollDelegate, $ionicLoading, User) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  User.query('me').then(function (response) {
    $scope.user = response.data;
  });

  $scope.$watch('user', function (newValue) {
    if (newValue !== undefined) {
      initGroups($scope.groups, newValue.preferences);
      initFavRU(newValue.preferences);
    }
  });

  var initGroups = function (groups, userPreferences) {
    groups.forEach(function (group) {
      group.items.forEach(function (item) {
        userPreference = userPreferences[item.field_id];
        if (userPreference !== undefined) {
          item.checked = userPreference;
        }
      });
    });
  };

  var isChecked = function (group, item) {
    var itemToCheck = $scope.user.preferences[group].items.filter(function (value, index) {
      return items[value] === item[value];
    })[0];
  };

  $scope.groups = [
    {
      'name': 'Mes préférences alimentaires',
      'items': [
        {'name': 'Végétarien',  'checked': false, 'field_id' : 'vegetarian'},
        {'name': 'Végétalien',  'checked': false, 'field_id' : 'vegan'},
        {'name': 'Sans porc', 'checked': false, 'field_id' : 'nopork'},
        {'name': 'Sans veau',  'checked': false, 'field_id' : 'noveal'},
        {'name': 'Sans gluten',  'checked': false, 'field_id' : 'nogluten'},
        {'name': 'Sans arachide', 'checked': false, 'field_id' : 'nopeanut'},
        {'name': 'Sans fruits à coque', 'checked': false, 'field_id' : 'nonut'},
        {'name': 'Sans oeufs',  'checked': false, 'field_id' : 'noeggs'},
        {'name': 'Sans lait',  'checked': false, 'field_id' : 'nomilk'},
        {'name': 'Sans poissons', 'checked': false, 'field_id' : 'nofish'},
        {'name': 'Sans crustacés', 'checked': false, 'field_id' : 'nocrustacean'},
        {'name': 'Sans patates :)', 'checked': false, 'field_id' : 'nopotato'}
      ]
    }
  ];

  /* get restaurant list (for favorite RU selection) */
  var defineRestaurants = function () {
    // Ensure restaurants are defined as we depend on it
    if (rulistservice.restaurants === undefined) {
      var successCallback = function (data) {
        $scope.rulist = data;
        $scope.currentRu = $scope.rulist[0];
        $ionicLoading.hide();
      };

      var errorCallback = function (error, data) {
        $scope.msg = "Impossible de se connecter pour récupérer la liste des restaurants";
        $scope.rulist = data;
        $ionicLoading.hide();
      };

      rulistservice.defineRUList(successCallback, errorCallback);

    } else {
      $scope.rulist = rulistservice.restaurants;
      $scope.currentRu = $scope.rulist[0];
      $ionicLoading.hide();
    }
  };

  var initFavRU = function (userPreferences) {
    defineRestaurants();
    if(userPreferences.favorite_ru !== undefined)
      $scope.currentRu = findById($scope.rulist, userPreferences.favorite_ru);
  }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;

    } else {
      $scope.shownGroup = group;
    }

    setTimeout(function () {
      $ionicScrollDelegate.scrollBottom(true);
    }, 120);
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.updatePreferences = function (item) {
    User.updatePreferences(item);
  };

}]);
