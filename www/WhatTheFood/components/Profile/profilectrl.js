wtf.controller('profilectrl', ['$scope', '$sessionStorage', '$state', '$http', 'loginservice', '$ionicScrollDelegate', 'User',

function($scope, $sessionStorage, $state, $http, loginservice, $ionicScrollDelegate, User) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  User.query($sessionStorage.userId).then(function (response) {
    $scope.user = response.data;
  });

  $scope.$watch('user', function (newValue) {
    if (newValue !== undefined) {
      initGroups($scope.groups, newValue.preferences);
    }
  });

  var initGroups = function (groups, userPreferences) {
    groups.forEach(function (group) {
      group.items.forEach(function (item) {
        userPreference = userPreferences.filter(function (value) {
          return value.name === item.name;
        })[0];

        if (userPreference !== undefined) {
          item.checked = userPreference.checked;
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
      'name': 'Mes habitudes alimentaires',
      'items': [
        {'name': 'Végétarien',  'checked': false},
        {'name': 'Végétalien',  'checked': false},
        {'name': 'Pas de porc', 'checked': false},
        {'name': 'Pas de veau', 'checked': false}
      ]
    },
    {
      'name': 'Mes allergies',
      'items': [
        {'name': 'Gluten',    'checked': false},
        {'name': 'Crustacés', 'checked': false},
        {'name': 'Œufs',      'checked': false},
        {'name': 'Poisson',   'checked': false},
        {'name': 'Soja',      'checked': false}
      ]
    }
  ];

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
