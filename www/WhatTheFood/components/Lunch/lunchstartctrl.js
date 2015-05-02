wtf.controller('lunchstartctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {

  /* return to login if not connected */
  if (loginservice.gettoken() === null) { $state.go('login'); return; }

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
      $state.go('wtf.thanks');

    } else {
      rulistservice.feedback = [entree, plat, dessert, pain];
      $state.go('wtf.quizz');
    }
  };
}]);
