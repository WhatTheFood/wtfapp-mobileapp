wtf.controller('rulistctrl', ['$scope', '$http', '$state', 'rulistservice', '$ionicLoading', 'loginservice',
function($scope, $http, $state, rulistservice, $ionicLoading, loginservice) {


  console.info('Accessing list of RU.');

  if (!loginservice.islogged()) { $state.go('login'); return; }

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });

  var defineRestaurants = function () {
    // Ensure restaurants are defined as we depend on it
    if (rulistservice.restaurants === undefined) {
      var successCallback = function (data) {
        $scope.msg = "Voici les RUs près de vous";
        $scope.rulist = data;
        $ionicLoading.hide();
      };

      var errorCallback = function (error, data) {
        $scope.msg = "Impossible de se connecter pour récupérer la liste des restaurants";
        $scope.rulist = data;
        $ionicLoading.hide();
      };

      rulistservice.defineRUList(successCallback, errorCallback);

    } else {
      $scope.msg = "Voici les RUs près de vous";
      $scope.rulist = rulistservice.restaurants;
      $ionicLoading.hide();
    }
  };

  defineRestaurants();

  $scope.data = {};
  $scope.data.showSearch = true;

  /* estimated time */
  var clockImages = ['img/clock_green.png', 'img/clock_orange.png', 'img/clock_red.png'];

  /**
   * Get the current time estimation as a timeSlot index
   */
  $scope.getClockImage = function(queuevalue) {
    if(queuevalue === 0)
      return 'img/clock_green.png';

    if(queuevalue > 66)
      return clockImages[2];
    else if(queuevalue > 33)
      return clockImages[1];
    else
      return clockImages[0];
  };

  $scope.clearSearch = function() {
    $scope.data.searchQuery = '';
  };

  $scope.swipeleft = function(ruId) {
    setTimeout(function() {
      $state.go('wtf.rueat', {ruId: ruId});
    }, 500);
  };

  $scope.showDishCategory = function(category){
    return category.name == 'Plats' || category.name == 'Grillades';
  };

  $scope.goEatAt = function ( ruId ) {
    $state.go('wtf.rueat', {ruId: ruId});
  };

  // Caption
  $scope.demoCaption2 = "This is demoing the second classic transparency walk-through.\nit has a caption, " +
      "regular marking of DOM element,\n 'arrow' to DOM element as icon\n and a button to close the walkthrough";
  $scope.demoActive2 = true;
  console.log("HELL!")

}]);
