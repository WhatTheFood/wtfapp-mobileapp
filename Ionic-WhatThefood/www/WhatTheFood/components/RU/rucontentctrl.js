/**
 * Created by Rony on 14/02/2015.
 */

wtf.controller('rucontentctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
    function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {

    console.log($stateParams);

    $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i><br> Please wait.'
    });

    var restaurant = rulistservice.restaurants.filter(function(restaurant) {
        return restaurant.id == $stateParams.ruId;
    })
    rulistservice.facebookFriendsAtThisRu(restaurant[0].id, loginservice).then(function(result){
        $scope.facebookFriendsAtThisRu = result.data;
        $ionicLoading.hide();
        console.log("FRIENDS: " + $scope.facebookFriendsAtThisRu);
    });
    $scope.ru = restaurant[0];
    $scope.setContextRu($scope.ru);

    //$scope.ru.operationalhours =

    $scope.operationalhours = $sce.trustAsHtml('<b>' + restaurant[0].operationalhours.replace(/:/g, ":</b><br />").replace(/  /g, "<br /><b>"));
    $scope.access = $sce.trustAsHtml(restaurant[0].access.replace(/[?]/g, "?<br />"));
    console.log($scope.ru);

    $scope.groups = [
        {'name': 'En apprendre plus sur ce RU', 'items': []}
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
