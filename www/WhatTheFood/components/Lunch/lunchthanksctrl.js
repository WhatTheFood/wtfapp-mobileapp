wtf.controller('lunchthanksctrl', ['$http', '$scope', '$sce', '$state', '$stateParams', 'rulistservice', 'loginservice', '$ionicScrollDelegate', '$ionicLoading',
    function($http, $scope, $sce, $state, $stateParams, rulistservice, loginservice, $ionicScrollDelegate, $ionicLoading) {
        /* return to login if not connected */
        if(loginservice.gettoken() == "") {$state.go('login'); return;}


}]);
