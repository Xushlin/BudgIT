(function () {
    angular
        .module('forefrontBudgitApp.controllers')
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