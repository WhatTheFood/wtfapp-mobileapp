wtf.controller('lunchquizzctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
    function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {
		/* populate combobox */
		$scope.rulist = rulistservice.restaurants;
		$scope.currentRu = $scope.rulist[0];
		

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
		
		$scope.sendFeedback = function() {
			alert(rulistservice.feedback);
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
					"ate_alone": false,     --> C'est quoi �a ?
					"convivial_restaurant": true,     --> C'est quoi �a ?
					"enough_time_to_eat": true,     --> Ok �a je vois ce que c'est (vue 2 : "As-tu eu assez de temps pour manger ?")
					"seasoning": 2,     --> C'est quoi �a ?
					"cooking": 2,     --> C'est quoi �a ?
					"hot_meal": 2,     --> C'est quoi �a ?
					"meal_quality": 3,     --> C'est quoi �a ?
					"enjoyed_my_meal": 2,     --> C'est quoi �a ?
					"threw_away_food_itook": false,     --> C'est quoi �a ?
					"threw_away_food_was_served": true,     --> C'est quoi �a ?
					"bread_thrown": 2     --> C'est quoi �a ?
				  }
				]
			  }
			}
		*/

}]);
