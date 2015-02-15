/**
 * Created by Rony on 14/02/2015.
 */

wtf.controller('rucontentctrl', ['$scope', '$stateParams', 'rulistservice', 'loginservice', function($scope, $stateParams, rulistservice, loginservice) {
    var restaurant = rulistservice.restaurants.filter(function(restaurant) {
        return restaurant.id == $stateParams.ruId;
    })
    rulistservice.facebookFriendsAtThisRu(restaurant[0].id, loginservice).then(function(result){
        $scope.facebookFriendsAtThisRu = result.data;
        console.log($scope.facebookFriendsAtThisRu);
    });
    $scope.ru = restaurant[0];

}]);