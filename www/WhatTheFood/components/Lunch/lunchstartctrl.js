wtf.controller('lunchstartctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup',
function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading, $ionicPopup) {

  /* return to login if not connected */
  if (!loginservice.islogged()) { $state.go('login'); return; }

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });



  $scope.init = function() {
    rulistservice.getRestaurants(function(restaurants){
      $scope.rulist = restaurants;
      $scope.currentRu = $scope.rulist[0];
      rulistservice.getMenus( function(menus){
        $scope.menus = menus
      });
    });
  };

  $scope.init();

  /* populate combobox */
  $scope.$watch('rulist', function (newValue, oldValue) {
    if (newValue === undefined && oldValue === undefined) { return; }

    if (newValue !== undefined) {
      $scope.currentRu = $scope.rulist[0];
    }
  });

  $scope.currentRu = undefined;

  $scope.entree = 0;
  $scope.plat = 0;
  $scope.dessert = 0;
  $scope.pain = 0;

  $scope.date = new Date();

  $scope.next = function(entree, plat, dessert, pain) {
    if($scope.currentRu === undefined) {
      $ionicPopup.alert({
        title: 'Sélectionnez votre RU !'
      });
      return;
    }
    if(entree === 0 && plat === 0 && dessert === 0 && pain === 0) {
      rulistservice.feedback = [entree, plat, dessert, pain];
      $state.go('wtf.thanks');
    } else {
      rulistservice.feedback = [entree, plat, dessert, pain, $scope.currentRu];
      $state.go('wtf.quizz');
    }
  };
}]);
