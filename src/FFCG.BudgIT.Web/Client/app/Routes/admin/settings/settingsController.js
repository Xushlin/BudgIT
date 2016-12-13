(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('AdminSettingsController', AdminSettingsController);

    AdminSettingsController.$inject = ['$scope', 'dataPassingService', '$state', '$http', 'appSettings', 'tools'];

    function AdminSettingsController($scope, dataPassingService, $state, $http, appSettings,tools) {
        var vm = this;
        vm.tags = [];
        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/Tags',
            data: { }
        }).then(function successCallback(response) {
            vm.tags = response.data;
        }, function errorCallback(response) {
            tools.error(response.data);
        });

        vm.addTag = function (tag) {
            console.log(tag);
            vm.tags.push(tag);
            $http({
                method: 'POST',
                url: appSettings.serverPath + 'api/Tags',
                data: tag
            }).then(function successCallback(response) {
               
            }, function errorCallback(response) {
                var index = vm.tags.indexOf(tag);
                if (index > -1) {
                    vm.tags.splice(index, 1);
                }
                tools.error(response.data);
            });
        }
        vm.saveTag = function (tag, previousValue) {
            console.log(tag);
            console.log(previousValue);
            $http({
                method: 'PUT',
                url: appSettings.serverPath + 'api/Tags',
                data: tag
            }).then(function successCallback(response) {
                
            }, function errorCallback(response) {
                var index = vm.tags.indexOf(tag);
                if (index > -1) {
                    vm.tags[i].Title = previousValue;
                }
                tools.error(response.data);
            });
        }

        vm.deleteTag = function (tag) {
            console.log("deleting tag:")
            console.log(tag);
            var index = vm.tags.indexOf(tag);
            if (index > -1) {
                vm.tags.splice(index, 1);
            }
            $http({
                headers:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'DELETE',
                url: appSettings.serverPath + 'api/Tags',
                data: tag
            }).then(function successCallback(response) {
            }, function errorCallback(response) {
                vm.tags.push(tag);
                tools.error(response.data);
            });
        }


        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/StarRatingType',
        }).then(function successCallback(response) {
        
            vm.stars = response.data;
        }, function errorCallback(response) {
            tools.error(response.data);
        });
        vm.addStar = function (star) {
            console.log(star);
            vm.stars.push(star);
          
            $http({
                method: 'POST',
                url: appSettings.serverPath + 'api/StarRatingType',
                data: star
            }).then(function successCallback(response) {
               
            }, function errorCallback(response) {
                var index = vm.stars.indexOf(star);
                if (index > -1) {
                    vm.stars.splice(index, 1);
                }
                tools.error(response.data);
            });
        }
        vm.saveStar = function (star, previousValue) {

            $http({
                method: 'PUT',
                url: appSettings.serverPath + 'api/StarRatingType',
                data: star
            }).then(function successCallback(response) {
              
            }, function errorCallback(response) {
                var index = vm.stars.indexOf(star);
                if (index > -1) {
                    vm.stars[i].Title = previousValue;
                }
                tools.error(response.data);
            });
        }
        vm.deleteStar = function (star) {
            console.log("deleting star:")
            console.log(star);
            var index = vm.stars.indexOf(star);
            if (index > -1) {
                vm.stars.splice(index, 1);
            }
            $http({
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'DELETE',
                url: appSettings.serverPath + 'api/StarRatingType',
                data: star
            }).then(function successCallback(response) {
               
            }, function errorCallback(response) {
             
                vm.stars.push(star);
                tools.error(response.data);
            });
        }


        vm.propertyName = 'Title';
        vm.reverse = false;

        vm.sortBy = function (propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };

        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/Employee/GetEmployees',
            data: {}
        }).then(function successCallback(response) {
            vm.employees = response.data;
        }, function errorCallback(response) {
            tools.error(response.data);
        });

        vm.SetEmployeeRole = function (employee) {
            $http({
                method: 'PUT',
                url: appSettings.serverPath + 'api/Employee/EditEmployeeRole',
                params: { Email: employee.Email}
            }).then(function successCallback(response) {
                employee.Admin = response.data;
                tools.showSuccessAlert();
            }, function errorCallback(response) {
                tools.error(response.data);
            });
        };
    }


})();