wtf.controller('profilectrl', ['$scope','$state', '$http', 'loginservice', function($scope, $state, $http, loginservice) {

    $scope.gohome = function(){
        $state.go('wtf.rulist');
    }

    $scope.groups = [
        {'name': 'Mes habitudes alimentaires',
        'items': [
            'Végétarien',
            'Végétalien',
            'Pas de porc',
            'Pas de veau',
            'Halal',
            'Cacher'
        ]},
        {'name': 'Mes alergies',
        'items': [
            'Gluten',
            'Crustacés',
            'Œufs',
            'Poisson',
            'Soja'
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
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };

}]);
