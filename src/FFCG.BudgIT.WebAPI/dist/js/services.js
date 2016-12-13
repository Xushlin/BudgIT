(function () {
    angular
        .module('forefrontContactsApp.controllers')
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
        .module('forefrontContactsApp')
        .filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }]);
})();


angular.module('forefrontContactsApp').controller('CreateEventModalController',
    ["$scope", "$uibModalInstance", "items", "appSettings", "$http", "$filter", '$upload', 'tools', '$state',
    function ($scope, $uibModalInstance, items, appSettings, $http, $filter, $upload, tools, $state) {
    function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }
    function CSV2JSON(csv) {
        var array = CSVToArray(csv);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k]
            }
        }
        console.log(objArray);
        //var json = JSON.stringify(objArray);
        //var str = json.replace(/},/g, "},\r\n");

        return objArray;
    }
    $scope.dateOptions = {
        dateDisabled: false,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.dt = new Date();
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.MyFiles = [];
    $scope.attendee = { FirstName: "", LastName: "", Company: "", Email: "", PhoneNumber: "", LinkedIn: "", ImageUrl: null };
    function validateAttendee() {
        if ($scope.attendee.FirstName != null && $scope.attendee.LastName != null && $scope.attendee.Company != null && $scope.attendee.Email != null) {
            return true;
        } else {
            return false;
        }
    }
    $scope.addAttendee = function () {
        if (validateAttendee) {
            $scope.event.Attendees.push($scope.attendee);
            $scope.clearAttendee();
        }
    }
    $scope.clearAttendee = function () {
        $scope.attendee = { FirstName: "", LastName: "", Company: "", Email: "", PhoneNumber: "",LinkedIn:"", ImageUrl: null };
    }
    $scope.removeAttendee = function ($index) {
        $scope.event.Attendees.splice($index, 1);
    }
    $scope.handler = function (e, files) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $scope.event.Attendees = CSV2JSON(reader.result);
            $scope.$apply();
        }
        reader.readAsText(files[0]);
    }

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };
    $scope.ok = function () {

        var errors = [];
        if ($scope.event.Title === "" || $scope.event.Title === undefined) {
            errors.push({ Error: "The title is required, " });
        }

        if ($scope.event.StartDate === "" || $scope.event.StartDate===undefined) {
            errors.push({ Error: "The  start date is required, " });
        }
        
        if (errors.length > 0) {
            tools.error(errors);
            return;
        }
        console.log($scope.event);
        $scope.event.EndDate = $scope.event.StartDate;
   
        $http({
            method: 'POST',
            url: appSettings.serverPath + 'api/admin/CreateEvent',
            data: $scope.event
        }).then(function successCallback(response) {
            console.log(response);
            $uibModalInstance.close($scope.selected.item);
        }, function errorCallback(response) {
            tools.error(response.data);

        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

        var attendees = [];
        $scope.event = { StartDate: new Date(), EndDate: null, Title: "", Attendees: attendees };

        $scope.checkEmail = function () {
            $http({
                method: 'GET',
                url: appSettings.serverPath + 'api/Attendees/CheckEmail/',
                params: { email: $scope.attendee.Email }
            }).then(function successCallback(response) {
                if (response.data != null) {
                    $scope.attendee = response.data;
                }
            }, function errorCallback(response) {
                tools.error(response.data);
            });
        }

        $scope.onFileSelect = function ($files) {
        var $file = $files[0];
        $upload.upload({
            url: appSettings.serverPath + "api/Attendees/UploadAttendeePictrue",
            headers: {},
            method: "POST",
            data: { fileUploadObj: $scope.fileUploadObj },
            file: $file
        }).success(function (data, status) {
            if (status === 200) {
                $scope.attendee.ImageUrl = data;
            } else {
                $scope.isShowError = true;
                $scope.Errors = data.Errors;

            }
        }).error(function (error) {

        });
        };

        $scope.deletePic = function () {
            $scope.attendee.ImageUrl = null;
        };
}]);
angular.module('forefrontContactsApp.services', [])
    .service('dataPassingService', function () {
        var selectedEventId;

        return {
            getSelectedEventId: function () {
                console.log("getting id " + selectedEventId);
                return selectedEventId;
            },
            setSelectedEventId: function (value) {
                console.log("setting id to " + value);
                selectedEventId = value;
            }
        };
    });
angular.module('forefrontContactsApp').controller('EditEventModalController',
    ["$scope", "$uibModalInstance", "eventId", "appSettings", "$http", "$filter", "$upload", "tools", "$state",
        function ($scope, $uibModalInstance, eventId, appSettings, $http, $filter, $upload, tools, $state) {
    function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp((
        // Delimiters.
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        // Standard fields.
        "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"), "\"");
            } else {
                // We found a non-quoted value.
                var strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }
    function CSV2JSON(csv) {
        var array = CSVToArray(csv);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k]
            }
        }
        console.log(objArray);
        //var json = JSON.stringify(objArray);
        //var str = json.replace(/},/g, "},\r\n");

        return objArray;
    }
    $http({
        method: 'GET',
        url: appSettings.serverPath + 'api/admin/GetAdminEvent/' + eventId,
        data: { id: eventId }
    }).then(function successCallback(response) {
        console.log(response);
        // this callback will be called asynchronously
        // when the response is available
        $scope.event = response.data;
        $scope.attendees = response.data.Attendees;
        $scope.dt = new Date(response.data.StartDate)//$filter('date')(response.data.StartDate, "yyyy-MM-dd");

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
    $scope.dt = new Date();

    $scope.dateOptions = {
        dateDisabled: false,
        formatYear: 'yy',
        maxDate: new Date(2120, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.MyFiles = [];
    $scope.attendee = { FirstName: "", LastName: "", Company: "", Email: "", PhoneNumber: "", LinkedIn: "", ImageUrl: null };
    function validateAttendee() {
        if ($scope.attendee.FirstName != null && $scope.attendee.LastName != null && $scope.attendee.Company != null && $scope.attendee.Email != null) {
            return true;
        } else {
            return false;
        }
    }
    $scope.addAttendee = function () {
        if (validateAttendee) {
            $scope.event.Attendees.push($scope.attendee);
            $scope.clearAttendee();
        }
    }
    $scope.clearAttendee = function () {
        $scope.attendee = { FirstName: "", LastName: "", Company: "", Email: "", PhoneNumber: "", LinkedIn: "", ImageUrl: null };
    }
    $scope.removeAttendee = function ($index) {
        $scope.event.Attendees.splice($index, 1);
    }
    $scope.handler = function (e, files) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $scope.event.Attendees = CSV2JSON(reader.result);
            $scope.$apply();
        }
        reader.readAsText(files[0]);
    }
    $scope.ok = function () {
        var errors = [];
        if ($scope.event.Title === "" || $scope.event.Title === undefined) {
            errors.push({ Error: "The title is required, " });
        }

        if ($scope.event.StartDate === "" || $scope.event.StartDate === undefined) {
            errors.push({ Error: "The  start date is required, " });
        }

        if (errors.length > 0) {
            tools.error(errors);
            return;
        }
        $scope.event.EndDate = $scope.event.StartDate;
        $http({
            method: 'POST',
            url: appSettings.serverPath + 'api/admin/EditEvent',
            data: $scope.event
        }).then(function successCallback(response) {
            console.log(response);
            $uibModalInstance.close(null);
        }, function errorCallback(response) {
            tools.error(response.data);

        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.propertyName = 'fullname';
    $scope.reverse = false;

    $scope.sortBy = function (propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    $scope.attendees = [];

    $scope.checkEmail = function () {
        $http({
            method: 'GET',
            url: appSettings.serverPath + 'api/Attendees/CheckEmail/',
            params: { email: $scope.attendee.Email }
        }).then(function successCallback(response) {
            if (response.data != null) {
                $scope.attendee = response.data;
            }
        }, function errorCallback(response) {
            tools.error(response.data);
        });
    }

    $scope.onFileSelect = function ($files) {
        var $file = $files[0];
        $upload.upload({
            url: appSettings.serverPath + "api/Attendees/UploadAttendeePictrue",
            headers: {},
            method: "POST",
            data: { fileUploadObj: $scope.fileUploadObj },
            file: $file
        }).success(function (data, status) {
            if (status === 200) {
                $scope.attendee.ImageUrl = data;
            } else {
                $scope.isShowError = true;
                $scope.Errors = data.Errors;

            }
        }).error(function (error) {

        });
    };

    $scope.removePic = function () {
        $scope.attendee.ImageUrl = null;
    };
}]);
angular.module('forefrontContactsApp').factory("tools", ["$rootScope", "$location", "$timeout", "$sce", '$state',
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
var app = angular.module('forefrontContactsApp');
app
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});
app.directive('fileChange', ['$parse', function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function ($scope, element, attrs, ngModel) {
            var attrHandler = $parse(attrs['fileChange']);
            var handler = function (e) {
                $scope.$apply(function () {
                    attrHandler($scope, { $event: e, files: e.target.files });
                });
            };
            element[0].addEventListener('change', handler, false);
        }
    }
}]);