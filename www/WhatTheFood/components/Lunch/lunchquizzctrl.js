wtf.controller('lunchquizzctrl', ['$http', '$scope', '$sce', '$sessionStorage', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',

function ($http, $scope, $sce, $sessionStorage, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {
  /* return to login if not connected */
  if (!loginservice.islogged()) { $state.go('login'); return; }

  if (rulistservice.feedback === undefined || rulistservice.feedback.length === 0) { $state.go('wtf.lunch'); return; }

  /* Update the dish question */
  $scope.updateDishes = function() {
    if (rulistservice.feedback[4] === undefined) { console.log("current ru undefined!"); return null; }
    else {
      console.log("current ru defined, updating dishes!");
      console.log(rulistservice.feedback[4]);
    }
    // Reset display
    $scope.entree = null;
    $scope.plat = null;
    $scope.grillade = null;
    $scope.dessert = null;

    // If there is a menu in this restaurant
    if (rulistservice.feedback[4].menus !== undefined && rulistservice.feedback[4].menus.length > 0) {
      // Counter
      var counter = 0;
      // Get the food categories
      var foodcategories = rulistservice.feedback[4].menus[0].meal[0].foodcategory;
      // For each food categories, assign the corresponding array of dishes
      for (var i in foodcategories) {
        switch (foodcategories[i].name) {
          case "Entrées":
          case "Entrée":
          case "ENTREES":
          case "ENTREE":
            if (rulistservice.feedback[0]>0) {
              $scope.entree = foodcategories[i].dishes;
              $scope.currentEntree = $scope.entree[0];
              $scope.currentEntree.feedback = [];
              counter++;
            }
            break;
          case "Plats":
          case "Plat":
          case "PLATS":
          case "PLAT":
            if (rulistservice.feedback[1]>0) {
              $scope.plat = foodcategories[i].dishes;
              $scope.currentPlat = $scope.plat[0];
              $scope.currentPlat.feedback = [];
              counter++;
            }
            break;
          case "Grillades":
          case "Grillade":
          case "GRILLADES":
          case "GRILLADE":
            if (rulistservice.feedback[1]>0) {
              $scope.grillade = foodcategories[i].dishes;
              $scope.currentGrillade = $scope.grillade[0];
              $scope.currentGrillade.feedback = [];
              counter++;
            }
            break;
          case "Desserts":
          case "Dessert":
          case "DESSERTS":
          case "DESSERT":
            if (rulistservice.feedback[2]>0) {
              $scope.dessert = foodcategories[i].dishes;
              $scope.currentDessert = $scope.dessert[0];
              $scope.currentDessert.feedback = [];
              counter++;
            }
            break;
          default: console.log('UNKNOWN FOOD CATEGORY: '+foodcategories[i].name);
        }
      }

      /*
       * Gâché 1 plat : 1 question bonus aléatoire nourriture
       * Gâché 2 plats : 1 question bonus aléatoire nourriture et 1 contexte
       * Gâché 3 ou 4 plats : 2 questions bonus aléatoires nourriture et 1 contexte
       */
      $scope.questions = [];
      if (counter === 1) {
        $scope.questions.push(questions['food'][(Math.random() * questions['food'].length | 0)]);
      } else if (counter === 2) {
        $scope.questions.push(questions['food'][(Math.random() * questions['food'].length | 0)]);
        $scope.questions.push(questions['context'][(Math.random() * questions['context'].length | 0)]);
      } else if (counter >= 3) {
        rand1 = (Math.random() * questions['food'].length | 0);
        rand2 = rand1;
        while (rand1 === rand2) {
          rand2 = (Math.random() * questions['food'].length | 0);
        }
        $scope.questions.push(questions['food'][rand1]);
        $scope.questions.push(questions['food'][rand2]);
        $scope.questions.push(questions['context'][(Math.random() * questions['context'].length | 0)]);
      }
    } else {
      if(rulistservice.feedback[4].menus === undefined) {
        console.log("Menus are undefined for this RU");
      }
      else if(rulistservice.feedback[4].menus.length == 0) {
        console.log("Menus lenth is zero for this RU");
      }
      $state.go('wtf.thanks');
    }
  };

  /* quizz questions */
  questions = {
    'food': [
      {
        'question': 'Serais-tu prèt à reprendre ce plat la prochaine fois ?',
        'answers': {0: 'Oui', 1: 'Non ce n\'était pas bon', 2: 'Non je n\'aime pas ça'},
        'target': 'enjoyed_my_meal',
        'value': null
      },
      {
        'question': 'Comment était la préparation de ce plat ?',
        'answers': {0: 'Pas assez cuit', 1: 'Bien cuit', 2: 'Trop cuit'},
        'target': 'cooking',
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
    ]
  };

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

  $scope.init = function() {
    $scope.updateDate();
    $scope.updateDishes();
  };

  $scope.sendFeedback = function() {
    response = {'menus': rulistservice.feedback[4].menus};
    response.menus[0].feedback = [];

    /* get thrown values */
    userId = $sessionStorage.userId;
    if(rulistservice.feedback[0] > -1)
      $scope.currentEntree && $scope.currentEntree.feedback.push({'user_id': userId, 'thrown': rulistservice.feedback[0]});
    if(rulistservice.feedback[1] > -1)
      $scope.currentPlat && $scope.currentPlat.feedback.push({'user_id': userId, 'thrown': rulistservice.feedback[1]});
    if(rulistservice.feedback[2] > -1)
      $scope.currentGrillage && $scope.currentGrillade.feedback.push({'user_id': userId, 'thrown': rulistservice.feedback[2]});
    if(rulistservice.feedback[3] > -1)
      $scope.currentDessert && $scope.currentDessert.feedback.push({'user_id': userId, 'thrown': rulistservice.feedback[3]});

    /* get quizz answers */
    quizz = {};
    questions['food'].forEach(function(q, index){
      if(q.value !== null) {
        quizz[q.target] = q.value;
      }
    });
    questions['context'].forEach(function(q, index){
      if(q.value !== null) {
        quizz[q.target] = q.value;
      }
    });

    /* compile everything */
    response.menus[0].feedback.push(quizz);

    /* send feedback outta spaaace */
    var req = {
      method: 'PUT',
      dataType: "json",
      url: loginservice.getServerAPI() +'/restaurants/'+ rulistservice.feedback[4].id +'/menu',
      data: response,
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer "+ loginservice.gettoken()
      }
    };

    $http(req)
    .success(function (data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
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
     "thrown": 3,
     "user_id":"54def8a5769859a454e39974"
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
