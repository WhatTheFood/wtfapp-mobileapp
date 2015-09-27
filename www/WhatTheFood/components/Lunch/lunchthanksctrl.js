wtf.controller('lunchthanksctrl', ['$scope', '$state', 'loginservice', 'rulistservice', 'User',

function ($scope, $state, loginservice, rulistservice, User) {

  if (!loginservice.islogged()) { $state.go('login'); return; }

  $scope.goToStats = function () {
    $state.go('wtf.stats');
  };

  $scope.averageDishScore = 0;

  if(rulistservice.feedback != undefined && rulistservice.feedback.length > 0) {
    var table = rulistservice.feedback.slice(0, 4);
    var sum = table.reduce(function(a, b) { return parseInt(a) + parseInt(b); });
    var avg = sum / table.length;
    $scope.averageDishScore = Math.floor(avg);
  }

  var execute = function () {
    User.updatePoints('lunch-quizz');
  };

  if (!User.storage._id) {
    User.query('me').then(function (response) {
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

    var textListGood = [];
    textListGood[0] = 'Wow ! Bravo pour le zéro gâchis, un jour on les gouvernera tous !';
    textListGood[1] = 'Wow ! Bravo pour le zéro gâchis #teamglouton';
    textListGood[2] = 'Oh Yeah ! Pas une miette de rab sur le plateau !';
    textListGood[3] = 'Oh Yeah ! Pas une miette de rab sur le plateau !';
    textListGood[4] = 'Il ne te reste rien ? Youpi, en route pour la gloire !';

    var textListAverage = [];
    textListAverage[0] = 'Eh, il ne te reste pas tant que ça, bravo copain !';
    textListAverage[1] = 'On me signale un plateau presque vide JE RÉPETE : un plateau presque vide !';

    var textListBad = [];
    textListBad[0] = 'Il te reste beaucoup sur ton plateau, tu as passé un mauvais déjeuner ?';
    textListBad[1] = 'C’est pas aujourd’hui qu’on va sauver la planète du gaspillage, on retente demain ?';
    textListBad[2] = 'Pas toujours facile de tout finir hein ? On croit en toi !';

    var textList = textListGood;
    var s = scope.averageDishScore;
    if(s == 0) {
      textList = textListGood;
      imageType = "good"
    }
    else if(s == 1) {
      textList = textListAverage;
      imageType = "avg"
    }
    else if(s == 3  || s == 2) {
      textList = textListBad;
      imageType = "bad"
    }

    var rndNum = Math.floor((Math.random() * textList.length));

    img = angular.element(element[0].querySelector('#thanks-gif-image'));
    text = angular.element(element[0].querySelector('#thanks-gif-text'));

    text.html(textList[rndNum]);

    img.attr('src', 'img/gif_thanks_' + imageType + (rndNum+1) + '.gif');
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
