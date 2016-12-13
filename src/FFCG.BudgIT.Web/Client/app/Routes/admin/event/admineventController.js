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