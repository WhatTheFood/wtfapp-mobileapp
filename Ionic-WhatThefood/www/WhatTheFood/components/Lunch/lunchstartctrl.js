wtf.controller('lunchstartctrl', ['$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
    function($scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {
		$scope.entree = -1;
		$scope.plat = -1;
		$scope.dessert = -1;
		$scope.pain = -1;

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

		$scope.rememberFeedback = function(entree, plat, dessert, pain) {
			rulistservice.feedback = [entree, plat, dessert, pain];
		}

}]);
