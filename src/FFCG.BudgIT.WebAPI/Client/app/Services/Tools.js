angular.module('forefrontBudgitApp').factory("tools", ["$rootScope", "$location", "$timeout", "$sce", '$state',
    function ($rootScope, $location, $timeout, $sce, $state) {

    function showErrorAlert(errors, autoHide) {

        var alert;
        if (typeof errors == "string") {
            alert = {
                type: "danger",
                msg: errors
            };
        } else {
            var moreError = "";
            if (errors.Errors !== undefined) {
                errors = errors.Errors;
            }
            angular.forEach(errors, function(e) {
                moreError += e.Error;
            });
            alert = {
                type: "danger",
                msg: moreError
            };
        }

        $rootScope.alerts.push(alert);

        if (autoHide) {
            $timeout(function() {
                $rootScope.$apply(function() {
                    $rootScope.alerts.pop();
                });
            }, 3000, true);
        }
    }

    function isEmpty(value) {
        return typeof value === 'undefined';
    }

    return {
        showSuccessAlert: function(msg) {
            var alert = {
                type: "success",
                msg: "Success"
            };
            $rootScope.alerts.push(alert);
            $timeout(function() {
                $rootScope.$apply(function() {
                    $rootScope.alerts.pop();
                });
            }, 3000, true);
        },
        error: function(error) {
            if (error == "escape key press" || error == undefined) return;

            if (typeof error == 'string') {
                showErrorAlert(error, true);
            } else {
                if (error.Code == 401) {
                    $state.go('/');
                    return;
                } else {
                    showErrorAlert(error, true);
                    return;
                }
            }
        }
        
    };
}]);