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
      // Counter
      var counter = 0; // ???
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
      var counter = 0;
      if (rulistservice.feedback[0] > 0 && entrees.length > 0) {
        $scope.entree = entrees;
        $scope.currentEntree = $scope.entree[0];
        $scope.currentEntree.feedback = [];
        counter++;
      }
      if (rulistservice.feedback[1] >0 && plats.length > 0) {
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
       * Gâché 1 plat : 1 question aléatoire nourriture
       * Gâché 2 plats : 1 question aléatoire nourriture et 1 contexte
       * Gâché 3 ou 4 plats : 2 questions aléatoires nourriture et 1 contexte
       * Pain -> contexte uniquement
       * Préparation du plat -> uniquement si reste plat
       * Ru convivial -> une seule fois
       *
       * ルールだよ！ Those are the ruuuules!
       */

      $scope.questions = [];
      if (counter === 1) {
        /* 1 seul gaché */
        if (rulistservice.feedback[3] > 0) {
          /* mais c'est du pain */
          $scope.questions.push(questions['context'][(Math.random() * questions['context'].length | 0)]);
        } else {
          /* pour le reste */
          $scope.questions.push(questions['food'][(Math.random() * questions['food'].length | 0)]);
        }
      } else if (counter === 2) {
        /* 2 plats gachés */
        $scope.questions.push(questions['food'][(Math.random() * questions['food'].length | 0)]);
        $scope.questions.push(questions['context'][(Math.random() * questions['context'].length | 0)]);
      } else if (counter >= 3) {
        /* 3 plats ou plus gachés */
        rand1 = (Math.random() * questions['food'].length | 0);
        rand2 = rand1;
        while (rand1 === rand2) {
          rand2 = (Math.random() * questions['food'].length | 0);
        }
        $scope.questions.push(questions['food'][rand1]);
        $scope.questions.push(questions['food'][rand2]);
        $scope.questions.push(questions['context'][(Math.random() * questions['context'].length | 0)]);
      }
    }


    /* quizz questions */
    questions = {
      'food': [
        {
          'question': 'Serais-tu pret à reprendre ce plat la prochaine fois ?',
          'answers': {0: 'Oui', 1: 'Non ce n\'était pas bon', 2: 'Non je n\'aime pas ça'},
          'target': 'enjoyed_my_meal',
          'value': null
        },
        {
          'question': 'Comment était la préparation de ce plat ?',
          'answers': {0: 'Trop salé', 1: 'Trop sucré', 2: 'Trop huileux', 3: 'Trop fade', 4: 'Pas assez chaud'},
          'target': 'seasoning',
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
      ],
      'specific': { // TODO
        // 'entree': {
        //   'question': 'Comment était la préparation de l\'entrée ?',
        //   'answers': {0: '', 1: 'Comme il faut', 2: ''},
        //   'target': 'cooking_appetizer',
        //   'value': null
        // },
        'plat': {
          'question': 'Comment était la préparation de ce plat ?',
          'answers': {0: 'Pas assez cuit', 1: 'Bien cuit', 2: 'Trop cuit'},
          'target': 'cooking',
          'value': null
        },
        // 'dessert': {
        //   'question': 'Comment était la préparation de ce plat ?',
        //   'answers': {0: 'Pas assez cuit', 1: 'Bien cuit', 2: 'Trop cuit'},
        //   'target': 'cooking',
        //   'value': null
        // }
      }
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
        if (q.value !== null) {
          quizz[q.target] = q.value;
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
