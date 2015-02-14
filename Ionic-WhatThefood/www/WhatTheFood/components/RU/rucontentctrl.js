/**
 * Created by Rony on 14/02/2015.
 */

wtf.controller('rucontentctrl', ['$scope', '$stateParams', 'rulistservice', function($scope, $stateParams, rulistservice) {
    console.log($stateParams);
    console.log(rulistservice.restaurants);
    var restaurant = rulistservice.restaurants.filter(function(restaurant) {
        return restaurant.id == $stateParams.ruId;
    })
    //Force the date to a date where there is a menu (no menu on week-ends)
    var now = new Date(Date.parse("2015-02-10T00:00:00.000Z"));
    var menus = restaurant[0].menus.filter(function(menu) {
        var menuDate = new Date(Date.parse(menu.date));
        return (now.getDate() == menuDate.getDate() 
        && now.getMonth() == menuDate.getMonth()
        && now.getFullYear() == menuDate.getFullYear());
    })
    restaurant[0].menu = menus[0];
    $scope.ru = restaurant[0];
    console.log($scope.ru);
}]);