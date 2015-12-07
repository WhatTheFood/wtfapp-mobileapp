wtf.controller('lunchquizzctrl', ['$http', '$scope', '$sce', '$state', '$stateParams', '$ionicHistory', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading', '$ionicPopup',

  function ($http, $scope, $sce, $state, $stateParams, $ionicHistory, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading, $ionicPopup) {
    /* return to login if not connected */
    if (!loginservice.islogged()) {
      $state.go('login');
      return;
    }

    /* Update the dish question */
    $scope.updateDishes = function () {
      if (rulistservice.feedback[4] === undefined) {
        console.log("current ru undefined!");
        return null;
      }

      // Reset display
      $scope.entree = null;
      $scope.plat = null;
      $scope.dessert = null;
      $scope.pain = null;

      // If there is a menu in this restaurant
      var feedback = {
        menu: rulistservice.feedback[4].menusToday[0]
      }

      $scope.feedback = feedback;

      if (!(feedback.menu)) {
        /* $ionicPopup.alert({title: "Désolé, ce restaurant n'est pas ouvert aujourd'hui :("}); */
        $ionicPopup.alert({title: "Désolé, nous ne connaissons pas le menu de ce restaurant aujourd'hui :("});
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('wtf.lunch');
        return;
      }
      // Get the food categories
      var entrees = feedback.menu.dishes.filter(function (m) {
        return m.category == "STARTER";
      });
      var plats = feedback.menu.dishes.filter(function (m) {
        return m.category == "MAIN"
      });
      var desserts = feedback.menu.dishes.filter(function (m) {
        return m.category == "DESSERT"
      });
      var counter = 0; // number of wasted dish
      if (rulistservice.feedback[0] > 0 && entrees.length > 0) {
        $scope.entree = entrees;
        $scope.currentEntree = $scope.entree[0];
        $scope.currentEntree.feedback = [];
        counter++;
      }
      if (rulistservice.feedback[1] > 0 && plats.length > 0) {
        $scope.plat = plats;
        $scope.currentPlat = $scope.plat[0];
        $scope.currentPlat.feedback = [];
        counter++;
      }
      if (rulistservice.feedback[2] > 0 && desserts.length > 0) {
        $scope.dessert = desserts;
        $scope.currentDessert = $scope.dessert[0];
        $scope.currentDessert.feedback = [];
        counter++;
      }

      /* special case : bread */
      if (rulistservice.feedback[3] > 0) {
        $scope.pain = [{category: "OTHER", name: "pain"}];
        $scope.currentPain = $scope.pain[0];
        $scope.currentPain.feedback = [];
        counter++;
      }

      /*
       * Gâché 1 plat : 1 question nourriture
       * Gâché 2 plats : 1 question nourriture et 1 contexte aléatoire
       * Gâché 3 ou 4 plats : 2 questions nourriture et 1 contexte aléatoire
       * Pain -> contexte uniquement
       * Préparation du plat -> uniquement si reste plat
       * Ru convivial -> une seule fois (TODO)
       *
       * ルールだよ！ Those are the ruuuules!
       */

      $scope.questions = {'STARTER': [], 'MAIN': [], 'DESSERT': [], 'CONTEXT': []};

      // multiselect question always displayed for each meal
      if($scope.entree != null)
        $scope.questions['STARTER'].push(questions['food'][0]);
      if($scope.plat != null)
        $scope.questions['MAIN'].push(questions['food'][0]);
      if($scope.dessert != null)
        $scope.questions['DESSERT'].push(questions['food'][0]);

      // add a context question
      var random_ctx = questions['context'][(Math.random() * questions['context'].length | 0)];
      if(counter > 1 || (counter == 1 && $scope.pain != null))
        $scope.questions['CONTEXT'].push(random_ctx);

      // add the cooking question
      if(counter > 2 && $scope.plat != null)
        $scope.questions['MAIN'].push(questions['food'][1]);
    }


    /* quizz questions */
    questions = {
      'food': [
        {
          // this first question is special and does not display the same way
          'question': 'Comment était la préparation de ce plat ?',
          'answers': [{0: 'Trop salé', 1: 'Trop sucré', 2: 'Trop gras'},
                      {3: 'Trop fade', 4: 'Trop froid', 5: 'Trop servi'},
                      {6: 'Mais j\'ai bien aimé hein!'}],
          'value': [false, false, false, false, false, false, // seasoning
                    false], // enjoyed_my_meal
          'target': ['seasoning', 'enjoyed_my_meal'],
          'multiselect': true // you can check multiple values
        },
        {
          'question': 'Comment était la préparation de ce plat ?',
          'answers': {0: 'Pas assez cuit', 1: 'Bien cuit', 2: 'Trop cuit'},
          'target': 'cooking',
          'value': null
        }
      ],
      'context': [
        {
          'question': 'As-tu eu suffisamment de temps pour manger ?',
          'answers': {true: 'Oui', false: 'Non'},
          'target': 'enough_time_to_eat',
          'value': null
        },
        {
          'question': 'Avec qui as-tu mangé ?',
          'answers': {true: 'Seul', false: 'Avec des amis'},
          'target': 'ate_alone',
          'value': null
        },
        {
          'question': 'Est-ce que tu t\'es resservi ?',
          'answers': {true: 'Oui', false: 'Non'},
          'target': 'took_twice',
          'value': null
        },
        {
          'question': 'Est-ce que tu trouves le RU convivial ?',
          'answers': {true: 'Oui', false: 'Non'},
          'target': 'convivial_restaurant',
          'value': null
        }
      ]
    };

    $scope.date = new Date();

    $scope.init = function () {
      $scope.updateDishes();
    };

    $scope.sendFeedback = function () {

      /** ???
      response = {'menus': rulistservice.feedback[4].menus};
      response.menus[0].feedback = [];
      */


      var feedback = {};

      feedback.dishes = [];
      var thrownsDishes = [$scope.currentEntree,$scope.currentPlat,$scope.currentDessert,$scope.currentPain];
      for (var i = 0 ;i<4;i++){
        if (thrownsDishes[i]){
          feedback.dishes.push({
              dish: thrownsDishes[i],
              thrown: rulistservice.feedback[i]
            });
        }
      }

      /* get quizz answers */
      var quizz = {};
      questions['context'].forEach(function (q, index) {
        if (q.value !== null) {
          quizz[q.target] = q.value;
        }
      });
      questions['food'].forEach(function (q, index) {
        if(q.multiselect) {
          quizz[q.target[0]] = q.value.slice(0, 6); // seasoning
          quizz[q.target[1]] = q.value[6] ? 1 : 0; // enjoyed_my_meal
        } else {
          if (q.value !== null) {
            quizz[q.target] = q.value;
          }
        }
      });

      feedback.quizz = quizz;
      console.info(feedback);
      /* send feedback outta spaaace */
      var req = {
        method: 'PUT',
        dataType: "json",
        url: loginservice.getServerAPI() + '/menus/' + $scope.feedback.menu._id + '/feedback',
        data: {
          feedback: feedback
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + loginservice.gettoken()
        }
      };

      $http(req)
        .success(function (data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $ionicHistory.nextViewOptions({
            historyRoot: true
          });

          $state.go('wtf.thanks');
          return data;
        })
        .error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
          return "error";
        });
    };

    /* Query example:
     PUT http://localhost:5000/api/restaurants/747/menu -H "Content-Type:application/json" -H "Authorization: Bearer [[TOKEN]]"
     {
     "menus": {
     "date": "2015-03-05T00:00:00.000Z",
     "meal": [
     {
     "_id": "54df23b6842142426fdf9ff4",
     "name": "midi",
     "foodcategory": [
     {
     "name":"Entrées",
     "_id":"54df23b6842142426fdfa000",
     "dishes": [
     {
     "name":"Salade crétoise",
     "_id":"54df23b6842142426fdfa003",
     "feedback": [
     {
     "thrown": 3
     }
     ]
     }
     ]
     }
     ]
     }
     ],
     "feedback" : [
     {
     "ate_alone": false,
     "convivial_restaurant": true,
     "enough_time_to_eat": true,
     "seasoning": 2,
     "cooking": 2,
     "hot_meal": 2,
     "took_twice": true,
     "enjoyed_my_meal": 2,
     "bread_thrown": 2
     }
     ]
     }
     }
     */
  }]);
