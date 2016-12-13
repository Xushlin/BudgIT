(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$state', '$http', 'appSettings', 'localStorageService',
        '$rootScope', 'adalAuthenticationService', 'tools'];

    function LoginController($scope, $state, $http, appSettings, localStorageService, $rootScope, adalService, tools) {
        var vm = this;

        angular.element(document).ready(function () {
            if (!$rootScope.userInfo.isAuthenticated) {
                adalService.login();
            }
            if ($rootScope.userInfo.isAuthenticated) {
                if ($rootScope.checkCount === 0) {
                    var command = {
                        Email: $rootScope.userInfo.userName,
                        FirstName: $rootScope.userInfo.profile.given_name,
                        LastName: $rootScope.userInfo.profile.family_name
                    };
                    $http({
                        method: 'POST',
                        url: appSettings.serverPath + 'api/employee/CreateEmployee',
                        data: command
                    }).then(function successCallback(response) {

                        $rootScope.employee = response.data;
                        if ($rootScope.employee.Admin) {
                            if ($state.current.name === "/start") {
                                $state.go("/adminevents");
                            } else {
                                $state.go($state.current.name);
                            }
                        } else {
                            if ($state.current.name === "/start") {
                                $state.go("/events");
                            } else {
                                $state.go($state.current.name);
                            }
                        }
                    }, function errorCallback(response) {
                        tools.error(response.data);
                    });
                }
                $rootScope.checkCount += 1;
            }
        });
     
        var loginWithAd = function () {
            adalService.login();
        }

        vm.login = function () {
            loginWithAd();
        };

        $scope.login = function() {
            loginWithAd();
        };
        
        $scope.logout = function () {
            adalService.logOut();
            $state.go('/');
        };

//        vm.user = "Johan & Daniel!!";
//        vm.email = "";
//        vm.password = "";
//        vm.login = function () {
//            console.log("Logging in");
//            $http({
//                method: 'POST',
//                url: appSettings.serverPath + 'api/login/Login',
//                data: { email: vm.email }
//            }).then(function successCallback(response) {
//                console.log(response);
//                vm.apan = response.data;
//                $rootScope.username = response.data.FirstName + ' ' + response.data.LastName;
//                localStorageService.set("UserId", response.data.Id);
//                localStorageService.set("Admin", response.data.Admin);
//                localStorageService.set("FirstName", response.data.FirstName);
//                localStorageService.set("Email", response.data.Email);
//                localStorageService.set("LastName", response.data.LastName);
//                $state.go('/events');
//
//                // this callback will be called asynchronously
//                // when the response is available
//            }, function errorCallback(response) {
//                // called asynchronously if an error occurs
//                // or server returns response with an error status.
//            });
//        }
//
//        $http.get(appSettings.serverPath + 'api/attendees').then(function (result) { console.log(result)})
//        console.log(appSettings);
    }
})();