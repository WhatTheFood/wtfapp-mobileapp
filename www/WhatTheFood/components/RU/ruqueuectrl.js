wtf.controller('ruqueuectrl', ['$scope', '$state', '$stateParams', '$ionicHistory', '$http', 'rulistservice', 'loginservice',
    function($scope, $state, $stateParams, $ionicHistory, $http, rulistservice, loginservice) {

    /* return to login if not connected */
    console.log("checking connection")
    if(loginservice.gettoken() == "") { console.log("not connected"); $state.go('login'); return;}
    console.log("connected;")

    /* populate combobox */
    $scope.rulist = rulistservice.restaurants;
    $scope.currentRu = $scope.rulist[0];

    /* waiting times */
    $scope.waitingTimes = [
        {index: 0, title:'Je rentre dans le RU en moonwalk', img:'img/clock_green.png'},
        {index: 1, title:'Juste le temps de rêvasser', img:'img/clock_orange.png'},
        {index: 2, title:'On peut y réviser ses partiels', img:'img/clock_red.png'}
    ];

    $scope.sendVote = function(index) {
        console.log(index);

        if($scope.currentRu == null) return "error";

        var req = {
            method: 'POST',
            dataType: "json",
            url: loginservice.getServerAPI() +'/restaurants/'+ $scope.currentRu.id +'/queue/votes',
            data: '{"timeSlotIndex": '+ index +'}',
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+ loginservice.gettoken()
            }
        };

        console.log(req);

        $http(req)
        .success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $ionicHistory.goBack();
            return data;
        })
        .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(data);
            return "error";
        });
    };
}]);
