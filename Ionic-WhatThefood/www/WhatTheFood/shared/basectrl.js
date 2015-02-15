wtf.controller('basectrl', ['$scope', '$state', function($scope, $state) {
    $scope.ru = undefined;
    $scope.showQueue = function () {
        ruId = $scope.ru === undefined ? undefined : $scope.ru.id;
        $state.go('wtf.ruqueue', {ruId: ruId});
    };
    $scope.setContextRu = function(ru) {
        $scope.ru = ru;
    }
}]);