/**
 * Created by Rony on 14/02/2015.
 */

wtf.controller('rucontentctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', function($scope, $sce, $state, $stateParams, rulistservice, loginservice) {
    console.log($stateParams);

    var restaurant = rulistservice.restaurants.filter(function(restaurant) {
        return restaurant.id == $stateParams.ruId;
    })
    rulistservice.facebookFriendsAtThisRu(restaurant[0].id, loginservice).then(function(result){
        $scope.facebookFriendsAtThisRu = result.data;
        console.log("FRIENDS: " + $scope.facebookFriendsAtThisRu);
    });
    $scope.ru = restaurant[0];

    //$scope.ru.operationalhours =

    $scope.operationalhours = $sce.trustAsHtml('<b>' + restaurant[0].operationalhours.replace(/:/g, ":</b><br />").replace(/  /g, "<br /><b>"));
    $scope.access = $sce.trustAsHtml(restaurant[0].access.replace(/[?]/g, "?<br />"));
    console.log($scope.ru);

    function InfoRu($scope) {
      $scope.visible = false;
      $scope.toggle = function() {
        $scope.visible = !$scope.visible;
      };
    }
}]);


wtf.controller('InfoRu', ['$scope', '$sce', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', function($scope, $sce, $stateParams, rulistservice, loginservice, $ionicScrollDelegate) {
    $scope.visible = false;
    $scope.toggle = function() {
      $scope.visible = !$scope.visible;
      $ionicScrollDelegate.scrollBottom();
    };
}]);
