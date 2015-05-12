wtf.controller('basectrl', ['$scope', '$state', '$cordovaInAppBrowser', function($scope, $state, $cordovaInAppBrowser) {
    $scope.ru = undefined;
    $scope.showQueue = function () {
        var ruId = $scope.ru === undefined ? undefined : $scope.ru.id;
        $state.go('wtf.ruqueue', {ruId: ruId});
    };
    $scope.openExternal = function(url) {
        $cordovaInAppBrowser.open(url, 'system')
    }
    $scope.setContextRu = function(ru) {
        $scope.ru = ru;
    }
}]);
