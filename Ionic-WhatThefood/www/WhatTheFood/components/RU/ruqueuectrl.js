wtf.controller('ruqueuectrl', ['$scope', '$state', '$stateParams', 'rulistservice', 'loginservice', function($scope, $state, $stateParams, rulistservice, loginservice) {
   $scope.rulist = rulistservice.restaurants;
   console.log("state params: ", $stateParams.ruId);
   $scope.modelRu = $scope.rulist[0];
   $scope.preselectruId = $stateParams.ruId === undefined ? $scope.rulist[0].id : $stateParams.ruId;
   $scope.waitingTimes = [{title:'Je rentre dans le RU en moonwalk', img:'img/clock_green.png'}, 
   {title:'Juste le temps de rêvasser', img:'img/clock_orange.png'}, 
   {title:'On peut y réviser ses partiels', img:'img/clock_red.png'}];
}]);