wtf.controller('lunchthanksctrl', ['$scope', '$sessionStorage', '$state', 'loginservice', 'User',

function ($scope, $sessionStorage, $state, loginservice, User) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

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

}])
.directive('gifthanks', ['$window', '$timeout', function($window, $timeout) {
  return function(scope, element) {
    var win = angular.element($window);
    var rndNum = Math.floor((Math.random() * 10 ));

    var textList = [];
    textList[0] = 'Wow ! Bravo pour le zéro gachi, un jour on les gouvernera tous !';
    textList[1] = 'Wow ! Bravo pour le zéro gachi #teamglouton';
    textList[2] = 'Ouh Yeah ! Pas une miette de rab sur le plateau';
    textList[3] = 'Ouh Yeah ! Pas une miette de rab sur le plateau';
    textList[4] = 'Il ne te reste rien ? Youpi, en route pour la gloire !';
    textList[5] = 'Eh, il ne te reste pas tant que ça, bravo copain !';
    textList[6] = 'On me signale un plateau presque vide JE REPETE : un plateau presque vide !';
    textList[7] = 'Il te reste beaucoup sur ton plateau, tu as passé un mauvais déjeuner ?';
    textList[8] = 'C’est pas aujourd’hui qu’on va sauver la planète du gaspillage, on retente demain ?';
    textList[9] = 'Pas toujours facile de tout finir hein ? On croit en toi !';

    img = angular.element(element[0].querySelector('#thanks-gif-image'));
    text = angular.element(element[0].querySelector('#thanks-gif-text'));

    text.html(textList[rndNum]);

    img.attr('src', 'img/gif_thanks_' + (rndNum+1) + '.gif');
    function resize() {
        if (win.width / win.height < (img.width / img.height)) {
          img.css({'height':'100%','width':'auto'});
        } else {
          img.css({'width':'100%','height':'auto'});
        }
    }
    win.bind('resize', function() { resize(); });
    $timeout(function(){ win.triggerHandler('resize') });
  };
}]);
