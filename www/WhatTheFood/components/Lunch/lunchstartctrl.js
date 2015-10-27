wtf.controller('lunchstartctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup',
function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading, $ionicPopup) {

  /* return to login if not connected */
  if (!loginservice.islogged()) { $state.go('login'); return; }

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });



  $scope.init = function() {
    console.log("init",rulistservice.getCurrentRu())
    rulistservice.getRestaurants(function(restaurants){
      $scope.rulist = restaurants;
      rulistservice.getMenus( function(menus){
        $scope.menus = menus
        $scope.currentRu = rulistservice.getCurrentRu();
      });
    });
  };

  $scope.init();

  /* populate combobox */

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
