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