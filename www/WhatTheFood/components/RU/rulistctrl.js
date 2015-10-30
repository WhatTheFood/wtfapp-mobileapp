
wtf.controller('rulistctrl', ['$scope', '$http', '$state', 'rulistservice', '$ionicLoading', 'loginservice','user','rulist','menus',
function($scope, $http, $state, rulistservice, $ionicLoading, loginservice, user,rulist,menus) {



  if (!loginservice.islogged()) { $state.go('login'); return; }

  /*
  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });
*/

  rulistservice.updateMenusInRestaurants();

  rulistservice.updateUserPreference(user);


  $scope.rulist = rulist;

  $scope.currentRu = rulistservice.getCurrentRu();

  $scope.menus = menus;

  $scope.isFreshInfo = function(updatedAt){
    return moment().diff(updatedAt,'minutes') < 15
  }


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

  $scope.goEatAt = function ( ruId ) {
    $state.go('wtf.rueat', {ruId: ruId});
  };

}]);
