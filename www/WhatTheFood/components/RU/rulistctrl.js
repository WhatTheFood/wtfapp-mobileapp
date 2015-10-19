wtf.controller('rulistctrl', ['$scope', '$http', '$state', 'rulistservice', '$ionicLoading', 'loginservice',
function($scope, $http, $state, rulistservice, $ionicLoading, loginservice) {


  console.info('Accessing list of RU.');

  if (!loginservice.islogged()) { $state.go('login'); return; }

  $ionicLoading.show({
    template: '<i class="button-icon icon ion-loading-a"></i><br>' + get_random_funny_wait_msgs()
  });

  $scope.update = function() {
    console.info('INIT');
    rulistservice.getRestaurants(function(restaurants){
      $scope.rulist = restaurants;
      $scope.currentRu = $scope.rulist[0];
    });
    rulistservice.getMenus( function(menus){
      $scope.menus = menus
    });
  };

  $scope.update();

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
    return category.name == 'Plats' || category.name == 'Grillades' || category.name == 'Pizzas';
  };

  $scope.goEatAt = function ( ruId ) {
    $state.go('wtf.rueat', {ruId: ruId});
  };

}]);
