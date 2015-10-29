wtf.controller('profilectrl', ['$scope', '$state', '$http', 'loginservice', 'rulistservice', '$ionicScrollDelegate', '$ionicLoading', 'user','rulist','menus','User',

function($scope, $state, $http, loginservice, rulistservice, $ionicScrollDelegate, $ionicLoading, user,rulist,menus,User) {

  if (!loginservice.islogged()) { $state.go('login'); return; }


  var initGroups = function (groups, userPreferences) {
    if (userPreferences === undefined){
      return;
    }
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

  $scope.init = function() {
    $scope.user = user;
    rulistservice.updateMenusInRestaurants();
    rulistservice.updateUserPreference(user);
    $scope.rulist = rulist;
    $scope.currentRu = rulist[0];
    $scope.menus = menus;
    initGroups($scope.groups, user.preferences);
    $scope.favoriteRu = rulistservice.getFavoriteRu();

  }

  $scope.init();


  $scope.$watch('favoriteRu', function (newValue, oldValue) {
    if (newValue) {
      if( $scope.user.favoriteRu != newValue.id ) {
        User.updatePreferences('favoriteRu', newValue.id);
      }
      rulistservice.setFavoriteRu(newValue.id);
      if ($scope.user.favoriteRu != newValue.id) {
        $scope.user.favoriteRu = newValue.id
      }
    }
    return newValue;
  });




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

  $scope.updateFoodPreferences = function (item) {
    User.updatePreferences(item.field_id, item.checked);
  };

  $scope.updateFavPreference = function (item) {
    User.updatePreferences('favorite_ru', item);
  };

}]);
