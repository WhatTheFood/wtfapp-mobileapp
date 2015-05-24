wtf.controller('lunchthanksctrl', ['$scope', '$sessionStorage', '$state', 'loginservice', 'User',

function ($scope, $sessionStorage, $state, loginservice, User) {

  /* return to login if not connected */
  if (loginservice.gettoken() === null) { $state.go('login'); return; }

  $scope.goToStats = function () {
    $state.go('wtf.stats');
  };

  var execute = function () {
    User.updatePoints('lunch-quizz');
  };

  if (!User.storage._id) {
    User.query($sessionStorage.userId).then(function (response) {
      $scope.user = response.data;
    });

    $scope.$watch('user', function (newValue) {
      if (newValue !== undefined) {
        execute();
      }
    });

  } else {
    execute();
  }
}]);
