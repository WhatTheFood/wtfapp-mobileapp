/**
 * Created by Rony on 14/02/2015.
 */

wtf.controller('rucontentctrl', ['$scope', '$stateParams', function($scope, $stateParams) {
    console.log($stateParams);
    $scope.ruId = $stateParams.ruId;
}]);