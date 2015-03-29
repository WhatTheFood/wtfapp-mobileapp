wtf.controller('lunchquizzctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
    function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {
		/* return to login if not connected */
        if(loginservice.gettoken() == "") {$state.go('login'); return;}

        /* populate combobox */
		$scope.rulist = rulistservice.restaurants;
		$scope.currentRu = $scope.rulist[0];

		/* Update the dish question */
		$scope.updateDishes = function() {
			// Reset display
			$scope.entree = null;
			$scope.plat = null;
			$scope.grillade = null;
			$scope.dessert = null;

			// If there is a menu in this restaurant
			if($scope.currentRu.menu != undefined) {
				// Counter
				var counter = 0;
				// Get the food categories
				var foodcategories = $scope.currentRu.menu.meal[0].foodcategory;
				// For each food categories, asign the corresponding array of dishes
				for(i in foodcategories) {
					switch(foodcategories[i].name) {
						case "Entrées":
						case "Entrée":
						case "ENTREES":
						case "ENTREE":
							if(rulistservice.feedback[0]>0) {
								$scope.entree = foodcategories[i].dishes;
								$scope.currentEntree = $scope.entree[0];
								counter++;
							}
							break;
						case "Plats":
						case "Plat":
						case "PLATS":
						case "PLAT":
							if(rulistservice.feedback[1]>0) {
								$scope.plat = foodcategories[i].dishes;
								$scope.currentPlat = $scope.plat[0];
								counter++;
							}
							break;
						case "Grillades":
						case "Grillade":
						case "GRILLADES":
						case "GRILLADE":
							if(rulistservice.feedback[1]>0) {
								$scope.grillade = foodcategories[i].dishes;
								$scope.currentGrillade = $scope.grillade[0];
								counter++;
							}
							break;
						case "Desserts":
						case "Dessert":
						case "DESSERTS":
						case "DESSERT":
							if(rulistservice.feedback[2]>0) {
								$scope.dessert = foodcategories[i].dishes;
								$scope.currentDessert = $scope.dessert[0];
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
                if(counter == 1)
                {
                    $scope.questions.push(questions['food'][(Math.random() * questions['food'].length | 0)]);
                } else if(counter == 2){
                    $scope.questions.push(questions['food'][(Math.random() * questions['food'].length | 0)]);
                    $scope.questions.push(questions['context'][(Math.random() * questions['context'].length | 0)]);
                } else if(counter >= 3){
                    rand1 = (Math.random() * questions['food'].length | 0);
                    rand2 = rand1;
                    while(rand1 == rand2) {rand2 = (Math.random() * questions['food'].length | 0)}
                    $scope.questions.push(questions['food'][rand1]);
                    $scope.questions.push(questions['food'][rand2]);
                    $scope.questions.push(questions['context'][(Math.random() * questions['context'].length | 0)]);
                }
			}
    	}

        /* quizz questions */
        enjoyed_my_meal = null;
        cooking = null;
        seasoning = null;
        enough_time_to_eat = null;
        ate_alone = null;
        took_twice = null;
        convivial_restaurant = null;
        questions = {
            'food': [
                {
                    'question': 'Serais-tu prèt à reprendre ce plat la prochaine fois ?',
                    'answers': {0: 'Oui', 1: 'Non ce n\'était pas bon', 2: 'Non je n\'aime pas ça'},
                    'target': enjoyed_my_meal
                },
                {
                    'question': 'Comment était la préparation de ce plat ?',
                    'answers': {0: 'Pas assez cuit', 1: 'Bien cuit', 2: 'Trop cuit'},
                    'target': cooking
                },
                {
                    'question': 'Comment était la préparation de ce plat ?',
                    'answers': {0: 'Trop salé', 1: 'Trop sucré', 2: 'Trop huileux', 3: 'Trop fade', 4: 'Pas assez chaud'},
                    'target': seasoning
                }
            ],
            'context': [
                {
                    'question': 'As-tu eu suffisamment de temps pour manger ?',
                    'answers': {true: 'Oui', false: 'Non'},
                    'target': enough_time_to_eat
                },
                {
                    'question': 'Avec qui as-tu mangé ?',
                    'answers': {true: 'Seul', false: 'Avec des amis'},
                    'target': ate_alone
                },
                {
                    'question': 'Est-ce que tu t\'es resservi ?',
                    'answers': {true: 'Oui', false: 'Non'},
                    'target': took_twice
                },
                {
                    'question': 'Est-ce que tu trouves le RU convivial ?',
                    'answers': {true: 'Oui', false: 'Non'},
                    'target': convivial_restaurant
                }
            ]
        }

		/* Update the date at the top */
		$scope.updateDate = function() {
			var d = new Date();

			var weekDaysArr = new Array();
			weekDaysArr[0] = "Dimanche";
			weekDaysArr[1] = "Lundi";
			weekDaysArr[2] = "Mardi";
			weekDaysArr[3] = "Mercredi";
			weekDaysArr[4] = "Jeudi";
			weekDaysArr[5] = "Vendredi";
			weekDaysArr[6] = "Samedi";

			var monthArr = new Array();
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

		}

		$scope.init = function() {
			$scope.updateDate();
			$scope.updateDishes();
		}

		$scope.sendFeedback = function() {
			alert(rulistservice.feedback);
			// TODO Send data to server
		}

		/*
		EXEMPLE de feedback au serveur : PUT /restaurants/{id}/menu
			{
			  "menus": {
				"date": "2015-03-05T00:00:00.000Z",
				"meal": [
				  {
					"_id": "54df23b6842142426fdf9ff4",
					"name": "midi",
					"foodcategory": [
					  {
						"name": "Entrées",
						"_id": "54df23b6842142426fdfa000",
						"dishes": [
						  {
							"name": "Salade crétoise",
							"_id": "54df23b6842142426fdfa003",
							"feedback": [
							  {
								"thrown": 3,
								"user_id": "54def8a5769859a454e39974"
							  }
							]
						  }
						]
					  }
					]
				  }
				],
				"feedback": [
				  {
					"ate_alone": false,
					"convivial_restaurant": true,
					"enough_time_to_eat": true,
					"seasoning": 2,
					"cooking": 2,
					"hot_meal": 2,     --> C'est quoi ?
					"meal_quality": 3,     --> C'est quoi ?
					"enjoyed_my_meal": 2,     --> C'est quoi ?
					"threw_away_food_itook": false,     --> C'est quoi ?
					"threw_away_food_was_served": true,     --> C'est quoi ?
					"bread_thrown": 2
				  }
				]
			  }
			}
		*/

}]);
