wtf.controller('basectrl', ['$scope', '$state', '$cordovaInAppBrowser', function($scope, $state, $cordovaInAppBrowser) {

    $scope.ru = undefined;
    $scope.showQueue = function () {
        var ruId = $scope.ru === undefined ? undefined : $scope.ru.id;
        $state.go('wtf.ruqueue', {ruId: ruId});
    };
    $scope.openExternal = function(url) {
        $cordovaInAppBrowser.open(url, 'system')
    }
    $scope.setContextRu = function(ru) {
        $scope.ru = ru;
    }

  $scope.showQueueTip = "\n\n\nIci tu peux indiquer\nsi ça bouche dans\nla queue de ton RU";
  $scope.showQueueTipActive = false;

  // RESET   localStorage["walkthrough"] = undefined;

  $scope.clickOnRuList = function() {
    var walkthrough;
    try {
      walkthrough= JSON.parse(localStorage["walkthrough"]);
    }
    catch(e)
    {
      walkthrough = {
        clickOnRuList: true
      };
    }
    if (walkthrough.clickOnRuList){
      $scope.showQueueTipActive = true;
      walkthrough.clickOnRuList = false;
      localStorage["walkthrough"]  = JSON.stringify(walkthrough);
    }
  }


}]);
