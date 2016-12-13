'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/adminevent', {
            url: '/adminevent/:id',
            templateUrl: '/Client/app/Routes/admin/event/adminevent.html',
            controller: 'AdminEventController',
            controllerAs: 'adminevent'
        });
  });

(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('AdminEventController', AdminEventController);

    AdminEventController.$inject = ['$scope', 'dataPassingService', '$state', '$http', 'appSettings', 'tools'];

    function AdminEventController($scope, dataPassingService, $state, $http, appSettings, tools) {
        var vm = this;
        vm.user = "Johan!";
        vm.currentEvent = [];
        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/admin/GetAdminEvent/' + $state.params.id,
            data: { id: $state.params.id }
        }).then(function successCallback(response) {
            vm.currentEvent = response.data;
            vm.attendees = response.data.Attendees;
            angular.forEach(vm.attendees, function (attendee) {
                attendee.avgRatings = [];
                attendee.avgRating = 0;
                if (attendee.FeedbackReceived) {
                    angular.forEach(attendee.FeedbackReceived, function (feedback) {
                        var starRatings = feedback.StarRatings;
                        angular.forEach(starRatings, function (starRating) {

                            var starRatingType = starRating.StarRatingType;

                            var isInList = _.findWhere(attendee.avgRatings, { Id: starRatingType.Id })
                            if (isInList === undefined) {
                                starRatingType.TotalScore = starRating.Score;
                                starRatingType.Count = 1;
                                attendee.avgRatings.push(starRatingType);
                            } else {
                                //console.log("already in list, should update score");
                                angular.forEach(attendee.avgRatings, function (rating) {
                                    if (rating.Id === starRatingType.Id) {
                                        rating.TotalScore += starRating.Score;
                                        rating.Count++;
                                    }
                                })
                            }
                        });
                        var score = 0;
                        var count = 0;
                        angular.forEach(attendee.avgRatings, function (rating) {
                            score += rating.TotalScore;
                            count += rating.Count;
                            rating.AvgScore = rating.TotalScore/rating.Count;
                        })
                        attendee.avgRating = score / count;

                    });
                };
            });
        }, function errorCallback(response) {
            tools.error(response.data);
        });
        vm.attendees = [];
        //vm.currentEvent = vm.mockEvent[$state.params.id-1];
        console.log("hej");

        vm.goToUser = function (userId) {
            $state.go('/adminuser', { userId: userId, eventId: $state.params.id });
        }
        vm.propertyName = 'fullname';
        vm.reverse = false;

        vm.sortBy = function (propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };

        vm.showFeedbackRow = -1;
        vm.showFeedback = function (row) {
            //console.log("show row " + row + " currentRow" + $scope.showFeedbackRow);
            if (vm.showFeedbackRow === row) {
                vm.showFeedbackRow = -1;
            } else {
                vm.showFeedbackRow = row;
            }
        }
    }


})();
'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/adminevents', {
            url: '/adminevents',
            templateUrl: '/Client/app/Routes/admin/events/adminevents.html',
            controller: 'AdminEventsController',
            controllerAs: 'adminevents'
        });
  });

(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('AdminEventsController', AdminEventsController);

    AdminEventsController.$inject = ['$scope', 'dataPassingService', '$state', 'appSettings', '$http', '$uibModal', '$upload', 'tools', "$rootScope"];

    function AdminEventsController($scope, dataPassingService, $state, appSettings, $http, $uibModal, $upload, tools, $rootScope) {
        var vm = this;
        vm.events = [];
        vm.currentPage = 1;
        vm.total;

        var filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", PageSize: $rootScope.perPageCountForEvent };

        var loadEventStart = function (filter) {
            $http({
                method: 'GET',
                url: appSettings.serverPath + 'api/events/GetEvents',
                params: filter
            }).then(function (result) {
                vm.total = result.data.Total;
                vm.events = result.data.Events;
            }, function (error) {
                tools.error(error.data);
            });
        };

        loadEventStart(filter);

        vm.goToEvent = function (eventId) {
            dataPassingService.setSelectedEventId(eventId);
            $state.go('/adminevent', {id: eventId });
        }
        
        
        vm.propertyName = 'StartDate';
        vm.reverse = true;

        vm.sortBy = function (propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };


        vm.items = ['item1', 'item2', 'item3'];
        vm.createEvent = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'Client/app/Routes/admin/events/createEvent.html',
                controller: 'CreateEventModalController',
                size: 'lg',
                resolve: {
                    items: function () {
                        return vm.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.selected = selectedItem;
                filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", Keyword: vm.keyword, PageSize: $rootScope.perPageCountForEvent };
                loadEventStart(filter);
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.editEvent = function (eventId) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'Client/app/Routes/admin/events/editEvent.html',
                controller: 'EditEventModalController',
                size: 'lg',
                resolve: {
                    eventId: function () {
                        return eventId;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                vm.selected = selectedItem;
                filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", Keyword: vm.keyword, PageSize: $rootScope.perPageCountForEvent };
                loadEventStart(filter);
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        vm.enterPress = function (event) {
            if (event.keyCode == 13) {
                event.stopPropagation();
                event.preventDefault();
                filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", Keyword: vm.keyword, PageSize: $rootScope.perPageCountForEvent };
                loadEventStart(filter);
                return false;
            }
        };

        vm.pageChanged = function () {
            filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", Keyword: vm.keyword, PageSize: $rootScope.perPageCountForEvent };
            loadEventStart(filter);
        }
    }
})();
'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/adminsettings', {
            url: '/admin/settings',
            templateUrl: '/Client/app/Routes/admin/settings/settings.html',
            controller: 'AdminSettingsController',
            controllerAs: 'settings'
        });
  });

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
'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/adminuser', {
            url: '/adminuser?userId&eventId',
            templateUrl: '/Client/app/Routes/admin/user/adminuser.html',
            controller: 'AdminUserController',
            controllerAs: 'adminuser'
        });
  });

(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('AdminUserController', AdminUserController);

    AdminUserController.$inject = ['$scope', 'dataPassingService', '$state', '$filter', '$http', 'appSettings', '$upload', 'tools'];

    function AdminUserController($scope, dataPassingService, $state, $filter, $http, appSettings, $upload, tools) {
        var vm = this;
        vm.user = "Johan!";
        vm.mockEvent = [];
        vm.attendees = [];
        vm.currentEventId = parseInt($state.params.eventId);

        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/admin/GetAdminUser/' + $state.params.userId,
            data: { id: $state.params.userId }
        }).then(function successCallback(response) {
            var attendee = JSON.parse(response.data);
            vm.attendee = attendee;

            var tags = [];
            angular.forEach(JSON.parse(response.data).FeedbackReceived, function (feedback) {
                tags = tags.concat(feedback.Tags);
            })
            vm.attendee.AllTags = _.unique(tags, function(item, key, Id) { 
                return item.Id;
            });
                var avgRating = 0;
                var noStarRatings = 0;
                angular.forEach(vm.attendee.FeedbackReceived, function (feedback) {
                    angular.forEach(feedback.StarRatings, function (starRating) {
                        avgRating += starRating.Score;
                        noStarRatings++;
                    })
                })
                vm.attendee.avgRating = avgRating / noStarRatings;
                vm.activePill = 0;
                vm.currentEvent = "Event"
                for (var i = 0; i < vm.attendee.SocialEvents.length; i++) {
                    if (vm.attendee.SocialEvents[i].Id === vm.currentEventId) {
                        vm.activePill = i;
                        vm.currentEvent = vm.attendee.SocialEvents[i].Title;
                    }
                }

        }, function errorCallback(response) {
            tools.error(response.data);
        });


        vm.tags = [
                    { text: 'just' },
                    { text: 'some' },
                    { text: 'cool' },
                    { text: 'tags' }
        ];
        vm.loadTags = function (query) {
            console.log($filter('filter')(vm.tags, query));
            return $filter('filter')(vm.tags, query);
//            return $http.get('/tags?query=' + query);
        };

        vm.updateAttendeeInfo = function () {
            var attendeeInfo = {
                Id: vm.attendee.Id,
                FirstName: vm.attendee.FirstName,
                LastName: vm.attendee.LastName,
                Company: vm.attendee.Company,
                PhoneNumber: vm.attendee.PhoneNumber,
                LinkedIn: vm.attendee.LinkedIn,
                ImageUrl: vm.attendee.ImageUrl,
                Email: vm.attendee.Email
            };
            $http({
                method: 'POST',
                url: appSettings.serverPath + 'api/admin/UpdateAttendeeInfo/',
                data: attendeeInfo
            }).then(function successCallback(response) {

            }, function errorCallback(response) {
                tools.error(response.data);
            });
        };

        console.log($state.params);
        vm.rate = {
            rating: null,
            contactRecruit: false,
            contactSales: false,
            comment: "",
            tags:[]
        }
        vm.goToUser = function (userId) {
            $state.go('/user', { userId: userId, eventId: $state.params.id });
        }
        vm.backToEvent = function () {
            $state.go('/adminevent', { id: $state.params.eventId });
        }


        vm.onFileSelect = function ($files) {
            var $file = $files[0];
            $upload.upload({
                url: appSettings.serverPath + "api/Attendees/UploadAttendeePictrue",
                headers: {},
                method: "POST",
                data: { fileUploadObj: $scope.fileUploadObj },
                file: $file
            }).success(function (data, status) {
                if (status === 200) {
                    vm.attendee.ImageUrl=data;
                } else {
                    $scope.isShowError = true;
                    $scope.Errors = data.Errors;
                  
                }
            }).error(function (error) {
                tools.error(error.data);
            });
        };

        vm.removePic= function() {
            vm.attendee.ImageUrl = null;
        }
    }


})();
'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/event', {
            url: '/event/:id',
            templateUrl: '/Client/app/Routes/event/event.html',
            controller: 'EventController',
            controllerAs: 'event'
        });
  });

(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('EventController', EventController);

    EventController.$inject = ['$scope', 'dataPassingService', '$state', '$http', 'appSettings', 'tools'];

    function EventController($scope, dataPassingService, $state, $http, appSettings, tools) {
        var vm = this;
        vm.user = "Johan!";
        vm.mockEvent = [];
        vm.attendees = [];
        //vm.currentEvent = vm.mockEvent[$state.params.id-1];
       
        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/events/GetEvent/' + $state.params.id,
            data: { id: $state.params.id }
        }).then(function successCallback(response) {
            vm.mockEvent = response.data;
            vm.attendees = response.data.Attendees;
        }, function errorCallback(response) {
            tools.error(response.data);

        });

        vm.goToUser = function (userId) {
            $state.go('/user', { userId: userId, eventId: $state.params.id });
        }

        vm.propertyName = 'fullname';
        vm.reverse = false;

        vm.sortBy = function (propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };
    }


})();
'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/events', {
            url: '/events',
            templateUrl: '/Client/app/Routes/events/events.html',
            controller: 'EventsController',
            controllerAs: 'events'
        });
  });

(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$scope', 'dataPassingService', '$state', 'appSettings', '$http', "tools", "$rootScope"];

    function EventsController($scope, dataPassingService, $state, appSettings, $http, tools, $rootScope) {

        var vm = this;
        vm.events = [];
        vm.currentPage = 1;
        vm.total;

        var filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", PageSize: $rootScope.perPageCountForEvent };

        var getEvents = function (filter) {

            $http({
                method: 'GET',
                url: appSettings.serverPath + 'api/events/GetEvents',
                params: filter
            }).then(function (result) {
                vm.total = result.data.Total;
                vm.events = result.data.Events;
            }, function (error) {
                tools.error(error.data);
            });

        };

        getEvents(filter);

        vm.goToEvent = function (eventId) {
            dataPassingService.setSelectedEventId(eventId);
            $state.go('/event', {id: eventId });
        }

        vm.propertyName = 'StartDate';
        vm.reverse = true;

        vm.sortBy = function (propertyName) {
            vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
            vm.propertyName = propertyName;
        };

        vm.enterPress = function (event) {
            if (event.keyCode == 13) {
                event.stopPropagation();
                event.preventDefault();
                filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", Keyword: vm.keyword, PageSize: $rootScope.perPageCountForEvent };
                getEvents(filter);
                return false;
            }
        };

        vm.pageChanged= function() {
            filter = { PageIndex: vm.currentPage, OrderByPropertyName: "Title", Keyword: vm.keyword, PageSize: $rootScope.perPageCountForEvent };
            getEvents(filter);
        }
    }
})();
'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/login', {
            url: '/login',
            templateUrl: '/Client/app/Routes/login/login.html',            
            controllerAs: 'loginCtrl',
            controller: 'LoginController'
        });
  });

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
'use strict';

angular.module('forefrontContactsApp')
  .config(function ($stateProvider) {
      $stateProvider
        .state('/user', {
            url: '/user?userId&eventId',
            templateUrl: '/Client/app/Routes/user/user.html',
            controller: 'UserController',
            controllerAs: 'user'
        });
  });

(function () {
    angular
        .module('forefrontContactsApp.controllers')
        .controller('UserController', UserController);

    UserController.$inject = ['$scope', '$rootScope', 'dataPassingService', '$state', '$filter', '$http', 'appSettings', 'localStorageService', 'tools'];

    function UserController($scope, $rootScope,dataPassingService, $state, $filter, $http, appSettings, localStorageService, tools) {
        var vm = this;
        vm.user = "Johan!";
        vm.mockEvent = [];
        vm.attendees = [];
        vm.avgRating = 0;
        vm.starRatingsSelected = [];

        vm.addStarRating = function (rating) {
            var starRating = {type: rating.StarRatingType.Name, score: rating.Score}
            var isInList = _.findWhere(vm.starRatingsSelected, { type: starRating.type })
            if (isInList === undefined) {
                vm.starRatingsSelected.push(starRating);
            } else {
                //console.log("already in list, should update score");
                angular.forEach(vm.starRatingsSelected, function (rating) {
                    if (rating.type === starRating.type) {
                        rating.score = starRating.score;
                    }
                })
            }
            var avg = 0;
            for (var i = 0; i < vm.starRatingsSelected.length; i++) {
                avg += vm.starRatingsSelected[i].score;
            }
            vm.avgRating = avg / vm.starRatingsSelected.length;

        }

        vm.rate = {
            FeedbackId:0,
            UserId: $state.params.userId,
            EventId: $state.params.eventId,
            StarRating: null,
            ContactRecruit: false,
            ContactSales: false,
            Comment: "",
            Tags: [],
            EmployeeId:localStorageService.get("UserId")
        }

        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/events/GetEvent/' + $state.params.eventId
        }).then(function successCallback(response) {
            console.log(response);
            // this callback will be called asynchronously
            // when the response is available
            vm.currentEvent = response.data;
        }, function errorCallback(response) {
            tools.error(response.data);

        });

        $http({
            method: 'POST',
            url: appSettings.serverPath + 'api/attendees/GetAttendeeForEvent',
            data: { userId:$state.params.userId, eventId: $state.params.eventId }
        }).then(function successCallback(response) {
            console.log(response);
            vm.attendee = response.data;
            vm.rate.Tags = response.data.Tags;
            vm.rate.ContactRecruit = response.data.Recruit;
            vm.rate.ContactSales = response.data.SalesOpportunity;
            vm.rate.Comment = response.data.Comment;
            vm.rate.Comment = response.data.Comment;
            vm.rate.FeedbackId = response.data.FeedbackId;
            vm.rate.StarRating = response.data.StarRatings;
            
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            tools.error(response.data);

        });

        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/tags/'
        }).then(function successCallback(response) {
            console.log(response);
            vm.tags = response.data;
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            tools.error(response.data);

        });

        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/StarRatingType'
        }).then(function successCallback(response) {
            console.log(response);
            vm.rate.StarRating = [];
            for (var i = 0; i < response.data.length; i++) {
                vm.rate.StarRating.push({ Score: null, StarRatingType: response.data[i] });
            }
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            tools.error(response.data);

        });
        vm.tags = [];
        vm.loadTags = function (query) {
            console.log($filter('filter')(vm.tags, query));
            return $filter('filter')(vm.tags, query);
//            return $http.get('/tags?query=' + query);
        };

        vm.rateUser = function () {
          
            console.log(vm.rate);
            for (var i = 0; i < vm.rate.StarRating.length; i++) {
                if (vm.rate.StarRating[i].Score===0) {
                    tools.error("Star rating is required");
                    return;
                }
            }
            vm.rate.EmployeeId = $rootScope.employee.Id;
            $http({
                method: 'POST',
                url: appSettings.serverPath + 'api/attendees/RateAttendeeForEvent',
                data: vm.rate
            }).then(function successCallback(response) {
                console.log(response);
                // this callback will be called asynchronously
                // when the response is available
                    $state.go('/event', { id: $state.params.eventId });
            }, function errorCallback(response) {
                tools.error(response.data);
            });
        };
       

        vm.backToEvent = function () {
            $state.go('/event', { id: $state.params.eventId });
        }
    }


})();