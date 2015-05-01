wtf.controller('profilectrl', ['$scope','$state', '$http', 'loginservice', '$ionicScrollDelegate', function($scope, $state, $http, loginservice, $ionicScrollDelegate) {

    /* return to login if not connected */
    if (loginservice.gettoken() === "") { $state.go('login'); return; }

    $scope.gohome = function(){
        $state.go('wtf.rulist');
    };

    $scope.groups = [
        {'name': 'Mes habitudes alimentaires',
        'items': [
            {'name': 'Végétarien', 'checked': false},
            {'name': 'Végétalien', 'checked': false},
            {'name': 'Pas de porc', 'checked': false},
            {'name': 'Pas de veau', 'checked': false},
        ]},
        {'name': 'Mes alergies',
        'items': [
            {'name': 'Gluten', 'checked': false},
            {'name': 'Crustacés', 'checked': false},
            {'name': 'Œufs', 'checked': false},
            {'name': 'Poisson', 'checked': false},
            {'name': 'Soja', 'checked': false}
        ]}
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

}]);
