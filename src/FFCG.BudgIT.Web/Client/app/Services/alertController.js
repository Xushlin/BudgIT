(function () {
    angular
        .module('forefrontBudgitApp.controllers')
        .controller('AlertController', AlertController);

    AlertController.$inject = ["$scope", "$rootScope"];

    function AlertController($scope, $rootScope) {
        $rootScope.alerts = [];
        $scope.alerts = $rootScope.alerts;
        $scope.closeAlert = function (index) {
            $rootScope.alerts.splice(index, 1);
        };
    }
})();

(function () {
    angular
        .module('forefrontBudgitApp')
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }]);
})();

