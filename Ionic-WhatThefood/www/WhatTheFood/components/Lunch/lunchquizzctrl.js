wtf.controller('lunchquizzctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
    function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {
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

				// TODO: random choices
			}
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
			monthArr[1] = "f�vrier";
			monthArr[2] = "mars";
			monthArr[3] = "avril";
			monthArr[4] = "mai";
			monthArr[5] = "juin";
			monthArr[6] = "juillet";
			monthArr[7] = "ao�t";
			monthArr[8] = "septembre";
			monthArr[9] = "octobre";
			monthArr[10] = "novembre";
			monthArr[11] = "d�cembre";

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
