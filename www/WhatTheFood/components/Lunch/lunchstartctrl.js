wtf.controller('lunchstartctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup','user','rulist','menus',
function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading, $ionicPopup,user,rulist,menus) {

  /* return to login if not connected */
  if (!loginservice.islogged()) { $state.go('login'); return; }


  $scope.user = user;
  $scope.rulist = rulist;
  $scope.menus = menus;
  rulistservice.updateMenusInRestaurants();
  rulistservice.updateUserPreference(user);
  $scope.currentRu = rulistservice.getDefaultCurrentRu();

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
