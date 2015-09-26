wtf.controller('lunchstartctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {

  /* return to login if not connected */
  if (!loginservice.islogged()) { $state.go('login'); return; }

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });

  $scope.defineRestaurants = function () {
    // Ensure restaurants are defined as we depend on it
    if (rulistservice.restaurants === undefined) {
      var successCallback = function (data) {
        $scope.rulist = data;
        $ionicLoading.hide();
      };

      var errorCallback = function (error, data) {
        $scope.rulist = data;
        $ionicLoading.hide();
      };

      rulistservice.defineRUList(successCallback, errorCallback);
    } else {
      $scope.rulist = rulistservice.restaurants;
      $ionicLoading.hide();
    }
  };

  $scope.init = function() {
    $scope.updateDate();
    $scope.defineRestaurants();
  };

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

  /* Update the date at the top */
  $scope.updateDate = function() {
    var d = new Date();

    var weekDaysArr = [];
    weekDaysArr[0] = "Dimanche";
    weekDaysArr[1] = "Lundi";
    weekDaysArr[2] = "Mardi";
    weekDaysArr[3] = "Mercredi";
    weekDaysArr[4] = "Jeudi";
    weekDaysArr[5] = "Vendredi";
    weekDaysArr[6] = "Samedi";

    var monthArr = [];
    monthArr[0] = "janvier";
    monthArr[1] = "février";
    monthArr[2] = "mars";
    monthArr[3] = "avril";
    monthArr[4] = "mai";
    monthArr[5] = "juin";
    monthArr[6] = "juillet";
    monthArr[7] = "août";
    monthArr[8] = "septembre";
    monthArr[9] = "octobre";
    monthArr[10] = "novembre";
    monthArr[11] = "décembre";

    $scope.date = weekDaysArr[d.getDay()] + " " + d.getDate() + " " + monthArr[d.getMonth()] + " - " + (d.getHours() < 17 ? "midi" : "soir");
  };

  $scope.next = function(entree, plat, dessert, pain) {
    if(entree === 0 && plat === 0 && dessert === 0 && pain === 0) {
      rulistservice.feedback = [entree, plat, dessert, pain];
      $state.go('wtf.thanks');
    } else {
      rulistservice.feedback = [entree, plat, dessert, pain, $scope.currentRu];
      $state.go('wtf.quizz');
    }
  };
}]);
