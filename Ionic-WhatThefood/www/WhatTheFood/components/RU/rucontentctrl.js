/**
 * Created by Rony on 14/02/2015.
 */

wtf.controller('rucontentctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
    function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {

    /* return to login if not connected */
    if(loginservice.gettoken() == "") {$state.go('login'); return;}

    $ionicLoading.show({
        template: '<i class="button-icon icon ion-loading-a"></i><br> Veuillez patienter.'
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

    /* estimated time */
    var waitingTimes = [
        {title:'Tu rentres dans le RU en moonwalk', img:'img/clock_green.png'},
        {title:'Juste le temps de rêvasser', img:'img/clock_orange.png'},
        {title:'On peut y réviser ses partiels', img:'img/clock_red.png'}
    ];

    /**
     * Get the current time estimation as a timeSlot index
     */
    var getQueueIndex = function(ru) {
        if(ru.queue.value == 0)
            return -1;

        if(ru.queue.value > 66)
            return 2;
        else if(ru.queue.value > 33)
            return 1;
        else
            return 0;
    };
    $scope.clockIndex = getQueueIndex($scope.ru);
    if($scope.clockIndex > -1) {
        $scope.clockImage = waitingTimes[$scope.clockIndex].img;
        $scope.clockTitle = waitingTimes[$scope.clockIndex].title;
    }

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
